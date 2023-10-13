import { Component } from '@angular/core';
import { FooldalService } from './services/fooldal.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from './services/user.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {
  title = 'Baba';

  menus: any[] = [];
  img: any[] = [];
  name: any[] = [];
  slogan: any[] = [];
  showNavbar: boolean = false;
  isNavbarCollapsed = false;
  faBars = faBars;
  isMenuOpen = false;
  showImage: boolean = true;
  spinner: boolean = false;
  username?: string;
  open: boolean = false;
  loggedUser: any;
  private loggedInUserSubscription?: Subscription;
  currentRoute?: string;
  isAdmin?: boolean;

  constructor(private fooldalService: FooldalService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onScroll() {
    this.showNavbar = window.scrollY > 0;
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showImage = this.router.url === '/fooldal';
      }
    });

    //menu
    this.fooldalService.getMenu().subscribe((linkSet) => {
      for (const [key, value] of Object.entries(linkSet)) {
        for (const key in value) {
          for (const k in value[key].item) {
            this.menus.push(value[key].item[k]);
          }
        }
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.spinner = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationError) {
        setTimeout(() => {
          this.spinner = false;
        }, 2500);
      }
    });

    this.loggedInUserSubscription = this.userService.loggedInUser$.subscribe(user => {
      this.loggedUser = user;
    });

    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      this.loggedUser = JSON.parse(isAuthenticated);
    }

    this.isAdmin = this.authService.isAdmin();
  }

  ngOnDestroy() {
    // Ne felejtsük el leiratkozni a feliratkozásról a komponens megsemmisítésekor
    this.loggedInUserSubscription?.unsubscribe();
  }

  getClassForRoute(route: any): string {
    if (route != "/admin/videotar") {
      return "max-width-600";
    }
    return "";
  }

  isNotFoundRoute(): boolean {

    return this.currentRoute !== '/not-found'; 
    
  }
  
}

