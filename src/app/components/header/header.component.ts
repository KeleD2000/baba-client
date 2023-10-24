import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FooldalService } from 'src/app/services/fooldal.service';


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
  enrolledCourse: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private fooldalService: FooldalService
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
          window.location.reload();
          this.authService.logout(login.logout_token, csrfToken).subscribe(logout => {
            console.log(logout);
          });
        }
      }, (error) => {
        console.log('Hiba történt: ', error);
      });
    }
    this.router.navigateByUrl("/fooldal");
  }

  ngOnInit(){
    this.fooldalService.enrolledUser().subscribe((t) => {
      for(const [key, value] of Object.entries(t)){
        const obj = {
          title : "",
          cid: 0
        }
        for(let c in value){
          for(let v in value[c]){
            if(v === 'title'){
              obj.title = value[c][v][0].value;
            }
            if(v === 'cid'){
              obj.cid = value[c][v][0].value;
            }
            
          }
        }
        if(obj.title !== ''){
          this.enrolledCourse.push(obj)
        }
        
      }

    });
  }
}
