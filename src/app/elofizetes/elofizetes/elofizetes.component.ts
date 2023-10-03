import { Component } from '@angular/core';
import { FooldalService } from 'src/app/services/fooldal.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-elofizetes',
  templateUrl: './elofizetes.component.html',
  styleUrls: ['./elofizetes.component.css']
})
export class ElofizetesComponent {
  courseTitle: any[] = [];
  courseDetails:any[] = [];
  courseNonEnrollmentDetails: any[] = [];
  

  constructor(private fooldalService: FooldalService, private shared: SharedService){

  }

  ngOnInit(){
    this.fooldalService.getCourses().subscribe((course) => {
      console.log(course);
      for(const [key,value] of Object.entries(course)){
        console.log(key, value);
        for(let c in value){
          for(let v in value[c]){
            if(v === 'title'){
              for(let i in value[c][v]){
                this.courseTitle.push(value[c][v][i].value);
              }
            }
          }
        }
      }
    
    });
    
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
      
    });
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
    
  }

}
