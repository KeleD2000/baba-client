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
  displayName: string = '';
  enrolledCourse: any[] = [];
  subscriber: boolean = false;
  videostore: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fooldalService: FooldalService
  ) { }
  isActiveMenu(menuPath: string) {
    return this.router.isActive(menuPath, true);
  }

  Logout() {
    const token = localStorage.getItem('login');
    if (token) {
      var login = JSON.parse(token);
      this.authService.fetchCsrfToken().subscribe((csrfToken: string) => {
        if (csrfToken) {
          this.authService.logout(login.logout_token, csrfToken).subscribe(logout => {
            console.log(logout);
            window.location.reload();
          });
        }
      }, (error) => {
        console.log('Hiba történt: ', error);
      });
    }
    this.router.navigateByUrl("/fooldal");
    localStorage.removeItem('product');
    localStorage.removeItem('display_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('api-key');
  }

  ngOnInit() {
    this.fooldalService.enrolledUser().subscribe( enrolled => {
      for(const [key, value] of Object.entries(enrolled)){
        if(key === 'courses'){
          for(let i in value){
            const enrolledCourseDetails = {
              title: '',
              cid: ''
            }
            enrolledCourseDetails.title = value[i].title[0].value;
            enrolledCourseDetails.cid = value[i].cid[0].value;

            this.enrolledCourse.push(enrolledCourseDetails);
          }
        }
      }
    })

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

              if (loginData && loginData.current_user && loginData.current_user.uid) {
                this.fooldalService.getAllUsers().subscribe(user => {
                  for (const [key, value] of Object.entries(user)) {
                    if (key === 'data') {
                      for (let i in value) {
                        if (value[i].attributes.drupal_internal__uid !== undefined) {
                          var allUid = value[i].attributes.drupal_internal__uid;
                        }
                        
                        var loginUid = Number(loginData.current_user.uid);
                        if (allUid !== undefined && allUid === loginUid) {
                          this.displayName = value[i].attributes.display_name;
                          localStorage.setItem('display_name', this.displayName);
                        }
                      }
                    }
                  }
                })
              }

              // Ellenőrizze, hogy az adatok tartalmaznak-e 'name' mezőt
              if (loginData && loginData.current_user && loginData.current_user.name) {
                const name = loginData.current_user.name;
                if (name === user.name) {
                  if (user.roles === 'videostore') {
                    this.videostore = true;
                  } else {
                    this.videostore = false;
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
  }
}
