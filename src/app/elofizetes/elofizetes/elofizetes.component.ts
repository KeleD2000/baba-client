import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FooldalService } from 'src/app/services/fooldal.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-elofizetes',
  templateUrl: './elofizetes.component.html',
  styleUrls: ['./elofizetes.component.css']
})
export class ElofizetesComponent {
  courseDetails:any[] = []; //feliratkozott
  courseNonEnrollmentDetails: any[] = [];//nem feliratkozott
  course: any[] = [];
  private loggedInUserSubscription?: Subscription;
  loggedUser: any;

  constructor(private fooldalService: FooldalService, private shared: SharedService, private userService: UserService, private authService: AuthService){

  }

  ngOnInit(){

    //bejelentkezve van e
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      this.loggedUser = JSON.parse(isAuthenticated);
    }
    console.log(this.loggedUser);

    //feliratkozott kurzusok
    this.fooldalService.enrolledUser().subscribe((course) => {
      //console.log(course);
      const obj = {
        cid: '',
        title: '',
        course_img : '',
        end_date: '',
      };
      for(const [key,value] of Object.entries(course)){
        for(let c in value){
          for(let v in value[c]){
            if(v === 'course_date'){
              for(let i in value[c][v]){
                obj.end_date = value[c][v][i].end_value;
              }
            }
            if(v === 'field_image'){
              obj.course_img = value[c][v];
            }
            if(v === 'title'){
              console.log(value[c][v][0].value);
              obj.title = value[c][v][0].value;
            }
            if(v === 'cid'){
              obj.cid = value[c][v][0].value;
              this.shared.setCID(obj.cid);
              
            }
          }
        }
      }
      this.courseDetails.push(obj);
      //console.log(this.courseDetails);
      console.log(this.shared.getCID());
      
    });

    //nem feliratkozott kurzusok
    this.fooldalService.nonEnrolledUser().subscribe((user) => {
      console.log(user);
      const obj = {
        cid:'',
        course_img : '',
        desc: '',
        price: '',
        discount_price: ''
      };
      this.courseNonEnrollmentDetails.push(obj);
      //console.log(this.courseNonEnrollmentDetails);
    });

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
      console.log(this.course);
    });    
  }

  ngOnDestroy() {
    if (this.loggedInUserSubscription) {
      this.loggedInUserSubscription.unsubscribe();
    }
  }

}
