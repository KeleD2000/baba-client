import { Component } from '@angular/core';
import { FooldalService } from 'src/app/services/fooldal.service';

@Component({
  selector: 'app-elofizetes',
  templateUrl: './elofizetes.component.html',
  styleUrls: ['./elofizetes.component.css']
})
export class ElofizetesComponent {
  courseTitle: any[] = [];

  constructor(private fooldalService: FooldalService){

  }

  ngOnInit(){
    this.fooldalService.getCourses().subscribe((course) => {
      for(const [key, value] of Object.entries(course)){
        //console.log(key,value);
        if(key === 'data'){
          //console.log(value);
          for(var i in value){
            //console.log(value[i].attributes.title);
            this.courseTitle.push(value[i].attributes.title);
          }
        }
      }
    });
    console.log(this.courseTitle);
  }

}
