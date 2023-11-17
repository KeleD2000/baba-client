import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from 'src/app/models/Login';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(300)]),
      transition(':leave', animate(300, style({ opacity: 0 })))
    ])
  ]
})
export class SigninComponent {

  loginForm: FormGroup;
  loginError?: string;
  showLoginAlert: boolean = false;

  constructor(private authService: AuthService, private route: Router, private userService: UserService, private activedRoute: ActivatedRoute) {
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
          this.userService.setLoggedInUser(loggedIn);
          this.authService.getApiKey().subscribe( api => {
            console.log(api);
          })
          localStorage.setItem("login", JSON.stringify(loggedIn));
          console.log(this.activedRoute.snapshot.queryParams['from'])
          if (this.activedRoute.snapshot.queryParams['from'] === 'elofizetes') {
            this.route.navigateByUrl('/fizetes');
          } else if (this.authService.isAdmin()) {
            this.route.navigateByUrl('/admin/videotar');
            
          } else {
            this.route.navigateByUrl('/elofizetes');
            console.log(loggedIn);
          }
        }
      }, error => {
        this.showLoginAlert = true;
        console.log(error.error.message);
        this.loginError = error.error.message;
        setTimeout(() => {
          this.showLoginAlert = false;
        }, 3000);
      });
    } else {
      if (this.loginForm.get('username')?.hasError('required')) {
        this.loginError = 'Felhasználó név megadása kötelező.';
      } else if (this.loginForm.get('password')?.hasError('required')) {
        this.loginError = 'Jelszó megadása kötelező.';
      }
  
      this.showLoginAlert = true;
      setTimeout(() => {
        this.showLoginAlert = false;
      }, 3000);
    }
  }
  


}
