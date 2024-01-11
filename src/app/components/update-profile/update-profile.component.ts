import { Component, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Register } from 'src/app/models/Register';
import { AuthService } from 'src/app/services/auth.service';
import { FooldalService } from 'src/app/services/fooldal.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent {
  registerForm: FormGroup;
  emailModel: string = '';
  display_nameModel: string = '';
  last_nameModel: string = '';
  first_nameModel: string = '';
  birthdateModel: string = '';
  postcodeModel: string = '';
  cityModel: string = '';
  streetModel: string = '';
  userIdReplace: string = '';
  snumberModel: string = '';
  countryModel: string = '';
  countryCode: string = '';
  showModal: boolean = false;
  modalTitle: string = '';
  modalContent: string = '';
  countryAvailable: any[] = [];

  constructor(private authService: AuthService, private router: Router, private fooldalService: FooldalService,
    private renderer: Renderer2) {
    this.registerForm = new FormGroup(
      {
        email: new FormControl('', [Validators.email]),
        display_name: new FormControl(''),
        first_name: new FormControl(''),
        last_name: new FormControl(''),
        birthdate: new FormControl(''),
        postcode: new FormControl(''),
        city: new FormControl(''),
        street: new FormControl(''),
        snumber: new FormControl(''),
        country: new FormControl(''),
        password: new FormControl('', [Validators.required])
      }
    )
  }

  ngOnInit() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.userIdReplace = userId?.replace(/"/g, '');
    }
    console.log(this.userIdReplace);
    this.fooldalService.getAllUsers().subscribe((user) => {
      for (const [key, value] of Object.entries(user)) {
        if (key === 'data') {
          for (let i in value) {
            if (value[i].id === this.userIdReplace) {
              this.emailModel = value[i].attributes.mail;
              this.display_nameModel = value[i].attributes.display_name;
              this.birthdateModel = value[i].attributes.field_birth_date;
            }
          }
        }
      }
    });
    this.fooldalService.getProfileCustomer().subscribe((profile) => {
      // Feltételezve, hogy van egy függvényed, ami lekéri az országok listáját az API-ból
      this.fooldalService.getCountryCode().subscribe((countryList: any) => {
        const availableCountries = countryList["available-countries"];

        for (const [code, name] of Object.entries(availableCountries)) {
          // Itt már tudjuk, hogy code egy string, és name is egy string
          this.countryAvailable.push({ code, name });
        }

        for (const [key, value] of Object.entries(profile)) {
          if (key === 'data') {
            for (let i in value) {
              console.log(value[i]);
              this.last_nameModel = value[i].attributes.address.family_name;
              this.first_nameModel = value[i].attributes.address.given_name;
              this.postcodeModel = value[i].attributes.address.postal_code;
              this.cityModel = value[i].attributes.address.locality;
              this.streetModel = value[i].attributes.address.address_line1;
              this.snumberModel = value[i].attributes.address.address_line2;
              const countryCode = value[i].attributes.address.country_code;
              for (let i in this.countryAvailable) {
                if (countryCode === this.countryAvailable[i].code) {
                  this.countryModel = this.countryAvailable[i].name;
                }
              }
            }
          }
        }
      });
    });

  }

  onSubmit() {
    const userData = {
      "data": {
        "type": "user--user",
        "id": this.userIdReplace,
        "attributes": {
          "mail": this.registerForm.get('email')?.value,
          "name": this.registerForm.get('email')?.value,
          "field_display_name": this.registerForm.get('display_name')?.value,
          "field_birth_date": this.registerForm.get('birthdate')?.value,
          "pass": {
            "existing": this.registerForm.get('password')?.value
          }
        }
      }
    }


    this.authService.updateUser(this.userIdReplace, userData).subscribe((regIn) => {
      if (regIn) {
        console.log(regIn);
        for (const [key, value] of Object.entries(regIn)) {
          if (key === 'data') {
            this.fooldalService.getCountryCode().pipe(
              switchMap(c => {
                for (const [key, value] of Object.entries(c)) {
                  if (key === 'available-countries') {
                    for (const [kk, vv] of Object.entries(value)) {
                      let code = this.registerForm.get('country')?.value
                      if (vv === code) {
                        console.log("Van találat");
                        this.countryCode = kk;
                      }
                    }
                  }
                }
                const addressBody = {
                  "data": {
                    "type": "profile--customer",
                    "id": this.userIdReplace,
                    "attributes": {
                      "address": {
                        "country_code": this.countryCode,
                        "locality": this.registerForm.get('city')?.value,
                        "postal_code": this.registerForm.get('postcode')?.value,
                        "address_line1": this.registerForm.get('street')?.value,
                        "address_line2": this.registerForm.get('snumber')?.value,
                        "given_name": this.registerForm.get('first_name')?.value,
                        "family_name": this.registerForm.get('last_name')?.value,
                      }
                    }
                  }
                }
                return this.authService.updateProfile(this.userIdReplace, addressBody);
              })
            ).subscribe(s => {
              console.log(s);
              this.openModal('succes-update');
            });
          }
        }
      }
    }
    );
  }

  openModal(platform: string) {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
    this.showModal = true;
    this.renderer.addClass(document.body, 'no-scroll');
  
    // Az adott platformnak megfelelő tartalom beállítása
    this.modalTitle = '';
    this.modalContent = '';
    switch (platform) {
      case 'succes-update':
        this.modalTitle = 'Sikeres módosítás';
        this.modalContent = 'Az adataid sikeresen módosította.';
        break;
    }
  
    // A popup tartalom és cím beállítása
    const modalTitleElement = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    if (modalTitleElement && modalBody) {
      modalTitleElement.innerHTML = this.modalTitle;
      modalBody.innerHTML = this.modalContent;
    }
  }

  closeModal() {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
    }
    this.showModal = false;
    this.renderer.removeClass(document.body, 'no-scroll');
  }

}
