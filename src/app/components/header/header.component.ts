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
  subscriber: boolean = false;

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
    this.fooldalService.getAllUsers().subscribe(s => {
      for (const [key, value] of Object.entries(s)) {
        if (key === 'data') {
          for (let i in value) {
            const user = {
              name: '',
              roles: ''
            };
            user.name = value[i].attributes.name;
            for (let j in value[i].relationships) {
              for (let k in value[i].relationships.roles.data) {
                if (value[i].relationships.roles.data[k].meta.drupal_internal__target_id) {
                  user.roles = value[i].relationships.roles.data[k].meta.drupal_internal__target_id;
                }
              }
            }
            if (localStorage.getItem('login')) {
              // Olvassa ki a 'login' kulcs alatt tárolt JSON adatot
              const loginData = JSON.parse(localStorage.getItem('login') || '');

              // Ellenőrizze, hogy az adatok tartalmaznak-e 'name' mezőt
              if (loginData && loginData.current_user && loginData.current_user.name) {
                const name = loginData.current_user.name;
                console.log('Felhasználó neve:', name);
                console.log(user.name);
                console.log(user.roles);
                if (name === user.name) {
                  if (user.roles === 'subscriber') {
                    console.log("Név megegyezik és a felhasználó feliratkozó.");
                    this.subscriber = true;
                  } else {
                    console.log("Név megegyezik, de a felhasználó nem feliratkozó.");
                    this.subscriber = false;
                  }
                  break; // Kilépés a ciklusból
                }
              } else {
                //console.log('A login adatok nem tartalmazzák a felhasználó nevét.');
              }
            } else {
              //console.log('A "login" kulcs nem található a localStorage-ban.');
            }
          }
        }
      }
    });

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
