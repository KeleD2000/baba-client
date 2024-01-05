import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.css']
})
export class LostPasswordComponent {
  lostpw: FormGroup;

  constructor(private authService: AuthService, private route: Router, private userService: UserService) {
    this.lostpw = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
      }
    )
  }

  lostPw() {
    if (this.lostpw.valid) {
      console.log(this.lostpw.get('email')?.value);
      const resetPw = {
        "mail" : this.lostpw.get('email')?.value
      }
      this.authService.lostPassword(resetPw).subscribe( pw => {
        console.log(pw);
      });
    }
  }

}
