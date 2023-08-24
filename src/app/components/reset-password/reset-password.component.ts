import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  resetpw: FormGroup;

  constructor(private authService: AuthService, private route: Router, private userService: UserService) {
    this.resetpw = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
      }
    )
  }

  resetPw(){
    if(this.resetpw.valid){
      console.log(this.resetpw.get('email')?.value);
      this.authService.resetPassword(this.resetpw.get('email')?.value).subscribe((response) => {
        if (response && Object.keys(response).length > 0) {
          // Sikeres válasz, itt tudod kezelni az adatokat
          console.log('Sikeres válasz:', response);
        } else {
          console.error('Üres válasz vagy érvénytelen adatok.');
        }
      });
    }
  }



}
