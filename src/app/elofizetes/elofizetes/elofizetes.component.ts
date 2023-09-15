import { Component } from '@angular/core';
import { FooldalService } from 'src/app/services/fooldal.service';

@Component({
  selector: 'app-elofizetes',
  templateUrl: './elofizetes.component.html',
  styleUrls: ['./elofizetes.component.css']
})
export class ElofizetesComponent {
  courseTitle: any[] = [];
  courseDateEnd: any[] = [];
  

  constructor(private fooldalService: FooldalService){

  }

  ngOnInit(){
    this.fooldalService.getCourses().subscribe((course) => {
      //console.log(course);
      for(const [key,value] of Object.entries(course)){
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
      for(const [key,value] of Object.entries(course)){
        for(let c in value){
          for(let v in value[c]){
            if(v === 'course_date'){
              for(let i in value[c][v]){
                this.courseDateEnd.push(value[c][v][i].end_value);
                console.log(this.courseDateEnd);
              }
            }
            if(v === 'field_image'){
              console.log(value[c][v]);
            }
          }
        }
      }
    });
    this.fooldalService.nonEnrolledUser().subscribe((user) => {
      console.log(user);
    });

  }

}
