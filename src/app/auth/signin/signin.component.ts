import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/Login';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  loginForm: FormGroup;

  constructor(private authService: AuthService, private route: Router, private userService: UserService) {
    this.loginForm = new FormGroup(
      {
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
      }
    )
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const user: Login = {
        name: this.loginForm.get('username')?.value,
        pass: this.loginForm.get('password')?.value
      }
      this.authService.login(user).subscribe((loggedIn) => {
        if (loggedIn) {
          console.log(loggedIn);
          /*this.userService.setLoggedInUser(loggedIn);
          localStorage.setItem("login", JSON.stringify(loggedIn));
          this.route.navigateByUrl('/fooldal');*/
        }
      });
    }
  }

}
