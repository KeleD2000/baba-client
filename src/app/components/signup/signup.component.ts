import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Address } from 'src/app/models/Address';
import { Register } from 'src/app/models/Register';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  registerForm: FormGroup;

  constructor(private authService: AuthService) {
    this.registerForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        name: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        birthdate: new FormControl('', Validators.required),
        postcode: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        street: new FormControl('', Validators.required),
        snumber: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required)
      }
    )
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData: Register = {
        mail: { value: this.registerForm.get('email')?.value },
        name: { value: this.registerForm.get('name')?.value },
        display_name: { value: this.registerForm.get('username')?.value },
        field_birth_date: { value: this.registerForm.get('birthdate')?.value.replace(/\./g, "-") },
      }

      this.authService.register(userData).subscribe((regIn) => {
        if (regIn) {
          console.log(regIn);
          /*
          for (const [key, value] of Object.entries(regIn)) {

            if (key == "uid") {
              console.log(key, value);
              var uid = value[0].value;
              console.log(uid);
              const userAddress: Address = {
                uid: {value: uid},
                postal_code: { value: this.registerForm.get('postcode')?.value },
                locality: { value: this.registerForm.get('city')?.value },
                address_line1: { value: this.registerForm.get('street')?.value },
                address_line2: { value: this.registerForm.get('snumber')?.value },
                country_code: { value: this.registerForm.get('country')?.value }
              }
              this.authService.registerAddress(userAddress).subscribe((regAddress) => {
                if(regAddress){
                  console.log(regAddress);
                }
              });
            }
          }*/

        }
      });
    }
  }

}
