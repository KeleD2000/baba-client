import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from 'src/app/models/Login';
import { AuthService } from 'src/app/services/auth.service';
import { FooldalService } from 'src/app/services/fooldal.service';
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
  allUserUsername: any[] = [];

  constructor(private authService: AuthService, private route: Router, private userService: UserService, private activedRoute: ActivatedRoute, private fooldalService: FooldalService) {
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
          for(const [key, value] of Object.entries(loggedIn)){
            console.log(key, value);
            if(key === 'current_user'){
              var username = value.name;
            }
            if(key === 'api-key'){
              localStorage.setItem('api-key', JSON.stringify(value));
            }
          }
          this.userService.setLoggedInUser(loggedIn);
          localStorage.setItem("login", JSON.stringify(loggedIn));
          if (this.activedRoute.snapshot.queryParams['from'] === 'elofizetes') {
            this.route.navigateByUrl('/elofizetes');
          } else if (this.authService.isAdmin()) {
            this.route.navigateByUrl('/admin/videotar');
            
          } else {
            this.route.navigateByUrl('/elofizetes');
            console.log(loggedIn);
          }
        }
        this.fooldalService.getAllUsers().subscribe((user) => {
          for (const [kk, vv] of Object.entries(user)) {
            if (kk === 'data') {
              for (let j in vv) {
                const currentUsername = vv[j].attributes.name;
        
                console.log(currentUsername);
        
                if (currentUsername === username) {
                  console.log(currentUsername);
                  console.log(username);
                  console.log(vv[j]);
                  localStorage.setItem("user_id", JSON.stringify(vv[j].id));
                  // Ha megtaláltuk a megfelelő felhasználót, akkor kiléphetünk a ciklusból
                  break;
                }
              }
            }
          }
        });
        
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
