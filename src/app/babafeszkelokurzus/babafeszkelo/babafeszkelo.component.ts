import { Component } from '@angular/core';
import { Page } from 'src/app/models/page';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';

@Component({
  selector: 'app-babafeszkelo',
  templateUrl: './babafeszkelo.component.html',
  styleUrls: ['./babafeszkelo.component.css']
})
export class BabafeszkeloComponent {

  content: any[] = [];

  getPhotos(i: any){
    switch(i){
      case 0 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/2BFkurzus3.jpg";
      case 4 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/2BFkurzus4.jpg";
      case 13 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/2BFkurzus1.jpeg";
      default: return '';
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
            if(page.page === 'Babafészkelő kurzus'){
              this.fooldalService.getFooldal(page.id).subscribe((page) =>{
                for(const [key, value] of Object.entries(page)){
                  for(var k in value.field_paragraphs){
                    if(value.field_paragraphs[k].field_content !== undefined){
                      const paragraph_value = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                      this.content.push(paragraph_value);
                      if(value.field_paragraphs[k].type === 'paragraph--image_text_blue'){
                        var kk = Number(k);
                        this.content.splice(kk+=2, 0, undefined);
                      }
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
    });
    console.log(this.content);
  }
}
