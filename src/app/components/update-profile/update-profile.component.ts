import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
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
  snumberModel: string = '';
  countryModel: string = '';
  countryAvailable: any[] = [];

  constructor(private authService: AuthService,private router: Router, private fooldalService: FooldalService) {
    this.registerForm =  new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        display_name: new FormControl('', [Validators.required]),
        first_name: new FormControl('', [Validators.required]),
        last_name: new FormControl('', [Validators.required]),
        birthdate: new FormControl('', [Validators.required]),
        postcode: new FormControl('',[Validators.required]),
        city: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
        snumber: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required])
      }
    )
  }

  ngOnInit(){
    const userId = localStorage.getItem('user_id');
    const userIdReplace = userId?.replace(/"/g, '');
    this.fooldalService.getAllUsers().subscribe((user) => {
      for(const[key, value] of Object.entries(user)){
        if(key === 'data'){
          for(let i in value){
            if(value[i].id === userIdReplace){
              console.log(value[i]);
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
    
        for(const [key, value] of Object.entries(profile)){
          if(key === 'data'){
            for(let i in value){
              console.log(value[i]);
              this.last_nameModel = value[i].attributes.address.family_name;
              this.first_nameModel = value[i].attributes.address.given_name;
              this.postcodeModel = value[i].attributes.address.postal_code;
              this.cityModel = value[i].attributes.address.locality;
              this.streetModel = value[i].attributes.address.address_line1;
              this.snumberModel = value[i].attributes.address.address_line2;
              const countryCode = value[i].attributes.address.country_code;
              for(let i in this.countryAvailable){
                if(countryCode === this.countryAvailable[i].code){
                  this.countryModel = this.countryAvailable[i].name;
                }
              }
            }
          }
        }
      });
    });
    
  }

  onSubmit(){

  }

}
