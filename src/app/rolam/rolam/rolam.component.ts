import { Component} from '@angular/core';
import { Page } from 'src/app/models/page';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';

@Component({
  selector: 'app-rolam',
  templateUrl: './rolam.component.html',
  styleUrls: ['./rolam.component.css']
})
export class RolamComponent {
  content: any[] = [];

  getPhotos(i: any){
    switch(i){
      case 0 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/6Rolam1.jpeg";
      case 2 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/6Rolam4.JPG";
      case 4 : return "https://www.youtube.com/embed/auMllD0l_m4";
      case 5 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/6Rolam2.jpeg";
      default : return '';
    }
  }

  constructor(private fooldalService: FooldalService, private htmlconvertService: HtmlconvertService){

  }

  ngOnInit(){
    this.fooldalService.getId().subscribe((i) => {
      for(const [key, value] of Object.entries(i)){
        if(Array.isArray(value)){
          for(const [k,v] of Object.entries(value)){
            const page: Page = {page: v.title, id: v.id};
            if(page.page === 'Rólam'){
              this.fooldalService.getFooldal(page.id).subscribe((page) =>{
                for(const [key, value] of Object.entries(page)){
                  for(var k in value.field_paragraphs){
                    if(value.field_paragraphs[k].field_content !== undefined){
                      const paragraph_value = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                      this.content.push(paragraph_value);
                    }else{
                      this.content.push(undefined);
                    }
                  }
                }
              });
            }
          }
        }
      }
      console.log(this.content);
    });
  }


}
