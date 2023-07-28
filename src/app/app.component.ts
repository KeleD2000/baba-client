import { Component} from '@angular/core';
import { FooldalService } from './services/fooldal.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { NavigationEnd, Router } from '@angular/router';
import { faFacebook, faKickstarter } from '@fortawesome/free-brands-svg-icons';


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
  faFB = faFacebook;
  isMenuOpen = false;
  showImage: boolean = true;

  
  constructor(private fooldalService: FooldalService, private router: Router){

  }

  toggleMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }

  Navigate(){
    this.router.navigate(["signin"]);
  }

  onScroll(){
    this.showNavbar = window.scrollY > 0;
  }

  isActiveMenu(menuPath: string) {
    return this.router.isActive(menuPath, true);
  }
  

  ngOnInit(){
    this.router.events.subscribe((event) =>{
      if(event instanceof NavigationEnd){
        this.showImage = this.router.url !== '/fooldal';
      }
    });

    //menu
    this.fooldalService.getMenu().subscribe((linkSet) => {
      for (const [key, value] of Object.entries(linkSet)) {
        for (const key in value) {
          for( const k in value[key].item){
            this.menus.push(value[key].item[k]);
          }
        }
      }
    });
    
  }
 
}
