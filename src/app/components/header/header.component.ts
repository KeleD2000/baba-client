import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() menus: any;
  @Input() loggedUser: any;
  @Input() showImage?: boolean;
  @Input() isAdmin?: boolean;

  constructor(
    private router: Router,
    private authService: AuthService
  ){}
  isActiveMenu(menuPath: string) {
    return this.router.isActive(menuPath, true);
  }

  Logout() {
    const token = localStorage.getItem('login');
    if (token) {
      var login = JSON.parse(token);
      this.authService.fetchCsrfToken().subscribe((csrfToken: string) => {
        if (csrfToken) {
          console.log(csrfToken);
          this.router.navigateByUrl("/fooldal");
          this.authService.logout(login.logout_token, csrfToken).subscribe(logout => {
            console.log(logout);
          });
        }
      }, (error) => {
        console.log('Hiba történt: ', error);
      });
    }
  }
}
