import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  registerForm: FormGroup;

  constructor(){
    this.registerForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        name: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        birthdate: new FormControl('', Validators.required),
        postcode: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        address: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required)
      }
    )
  }

}
