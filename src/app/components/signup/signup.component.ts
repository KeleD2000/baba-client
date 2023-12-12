import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Address } from 'src/app/models/Address';
import { Register } from 'src/app/models/Register';
import { AuthService } from 'src/app/services/auth.service';
import { FooldalService } from 'src/app/services/fooldal.service';
import { passwordMatchValidator } from 'src/app/validators/password-match-validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  registerForm: FormGroup;
  passwordInputStarted: boolean = false;
  loginError?: string;
  showLoginAlert: boolean = false;
  countryCode: string = '';

  constructor(private authService: AuthService,private router: Router, private fooldalService: FooldalService) {
    this.registerForm =  new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        display_name: new FormControl('', [Validators.required]),
        first_name: new FormControl('', [Validators.required]),
        last_name: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        passwordAccept: new FormControl('', [Validators.required]),
        birthdate: new FormControl('', [Validators.required]),
        postcode: new FormControl('',[Validators.required]),
        city: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
        snumber: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required])
      },{
        validators: passwordMatchValidator
      }
    )
  }

  onPasswordInput() {
    this.passwordInputStarted = true;
  }

  ngOnInit(){

  }

  onSubmit() {
    console.log(this.registerForm.valid);

    if (this.registerForm.valid) {
      const userData: Register = {
        mail: { value: this.registerForm.get('email')?.value },
        name: { value: this.registerForm.get('email')?.value },
        display_name: { value: this.registerForm.get('display_name')?.value },
        field_birth_date: { value: this.registerForm.get('birthdate')?.value.replace(/\./g, "-") },
        pass: { value: this.registerForm.get('password')?.value }

      }


      this.authService.register(userData).subscribe((regIn) => {
        if (regIn) {
          console.log(regIn);
          for (const [key, value] of Object.entries(regIn)) {
            if (key === 'uuid') {
              console.log(value[0].value);
              this.fooldalService.getCountryCode().pipe(
                switchMap(c => {
                  for (const [key, value] of Object.entries(c)) {
                    if (key === 'available-countries') {
                      for (const [kk, vv] of Object.entries(value)) {
                        let code = this.registerForm.get('country')?.value
                        console.log(code);
                        console.log(vv);
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
                      "id": value[0].value,
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
                      },
                      "relationships": {
                        "uid": {
                          "data": {
                            "type": "user--user",
                            "id": value[0].value
                          }
                        }
                      }
                    }
                  }
                  return this.authService.registerAddress(addressBody);
                })
              ).subscribe(s => {
                this.router.navigateByUrl('/signin');
              });
            }
          }
        }
      }, error => {
        this.showLoginAlert = true;
        this.loginError = error.error.message;
        setTimeout(() => {
          this.showLoginAlert = false;
        }, 3000);
      }
    
      );
    }
  }

}
