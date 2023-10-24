import { Component, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-elofizetes',
  templateUrl: './elofizetes.component.html',
  styleUrls: ['./elofizetes.component.css']
})
export class ElofizetesComponent {
  courseDetails:any[] = []; //feliratkozott
  courseDetailsExpires:any[] = [];
  courseNonEnrollmentDetails: any[] = [];//nem feliratkozott
  courseNonEnrollmentsDetailsExpires: any[] = [];
  course: any[] = [];
  courseCommercie: any[] = [];
  private loggedInUserSubscription?: Subscription;
  loggedUser: any;

  constructor(private fooldalService: FooldalService, private shared: SharedService, private htmlconvertService: HtmlconvertService, private authService: AuthService){

  }

  ngOnInit(){
    //bejelentkezve van e
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      this.loggedUser = JSON.parse(isAuthenticated);
    }

    //feliratkozott kurzusok
    this.fooldalService.enrolledUser().subscribe((course) => {
      //console.log(course);
      const obj = {
        cid: '',
        title: '',
        uuid: ''
      };
      for(const [key,value] of Object.entries(course)){
        for(let c in value){
          for(let v in value[c]){
            if(v === 'title'){
              obj.title = value[c][v][0].value;
            }
            if(v === 'cid'){
              obj.cid = value[c][v][0].value;
              this.shared.setCID(obj.cid);
            }
            if(v === 'uuid'){
              obj.uuid = value[c][v][0].value;
            }
          }
        }
      }
      this.courseDetails.push(obj);
    });

    this.fooldalService.enrolledCourseLicens().subscribe(s => {
      for (let j in this.courseDetails) {
        var uuid = this.courseDetails[j].uuid;
        for (const [key, value] of Object.entries(s)) {
          if (key === 'data') {
            for (let i in value) {
              const obj = {
                uuid: '',
                end_date: ''
              };
              obj.uuid = value[i].product_variation.product_id.field_course.id;
              if (obj.uuid === uuid) {
                obj.end_date = value[i].expires.substring(0, 10);
                this.courseDetailsExpires.push(obj); // Hozzáadja az objektumot csak akkor, ha az if feltétel teljesül
              }
            }
          }
        }
      }
    });    

    //nem feliratkozott kurzusok
    this.fooldalService.nonEnrolledUser().subscribe((user) => {
    
      for (const [key, value] of Object.entries(user)) {
        if (key === 'courses') {
          for (let i in value) {
            const obj = {
              title: value[i].title[0].value,
              uuid: value[i].uuid[0].value
            };
            this.courseNonEnrollmentDetails.push(obj);
          }
        }
      }
      console.log(this.courseNonEnrollmentDetails);
    
      // Most itt használjuk a nonEnrollmentDetails tömböt
      this.fooldalService.enrolledCourseLicens().subscribe(s => {
        for (let j in this.courseNonEnrollmentDetails) {
          var uuidNon = this.courseNonEnrollmentDetails[j].uuid;
    
          for (const [key, value] of Object.entries(s)) {
            if (key === 'data') {
              for (let i in value) {
                console.log(value[i]);
                const obj = {
                  uuid: '',
                  describe: '' as SafeHtml,
                  price: '',
                  discount_price: ''
                };
                
                obj.uuid = value[i].product_variation.product_id.field_course.id;
    
                if (obj.uuid === uuidNon) {
                  obj.describe = this.htmlconvertService.convertToHtml(value[i].product_variation.product_id.body.value);
                  obj.price = value[i].product_variation.list_price.formatted;
                  obj.discount_price = value[i].product_variation.price.formatted;
                  this.courseNonEnrollmentsDetailsExpires.push(obj);
                }
              }
            }
          }
          console.log(this.courseNonEnrollmentsDetailsExpires);
        }
      });
    });
    
    
    //kurzusok kiirása, amikor nincs bejelentkezve
    this.fooldalService.getCourses().subscribe( c => {
      for (const [key, value] of Object.entries(c)) {
        if (key === 'courses') {
          for (let i in value) {
            const objCourse = {
              title: value[i].title[0].value
            };
            this.course.push(objCourse);
          }
        }
      }
    });    
  }

  ngOnDestroy() {
    if (this.loggedInUserSubscription) {
      this.loggedInUserSubscription.unsubscribe();
    }
  }

}
