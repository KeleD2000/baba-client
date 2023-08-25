import { Component, ElementRef, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';

@Component({
  selector: 'app-tartalom',
  templateUrl: './tartalom.component.html',
  styleUrls: ['./tartalom.component.css']
})
export class TartalomComponent {
  content: any[] = [];


  getPhotos(i: any){
    switch(i){
      case 0 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/Logo_WhiteBIGbackground_main.png";
      case 2 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/1Fooldal1.jpeg";
      case 6 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/1Fooldal4_k.jpg"; 
      case 11 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/1Fooldal2_k.jpg";
      case 13 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/1Fooldal3_k.jpg";
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
            console.log(k,v);
            //console.log(v.path.alias);
            if(v.title === 'Főoldal'){
              this.fooldalService.getFooldal(v.id).subscribe((page) =>{
                for(const [key, value] of Object.entries(page)){
                  for(var k in value.field_paragraphs){
                    console.log(value.field_paragraphs);
                    if(value.field_paragraphs[k].field_content !== undefined){
                     // console.log(value.field_paragraphs[k].field_content.value);
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
  }

  /*
  ngOnInit(){
        //texts
        this.fooldalService.getTexts().subscribe((texts) => {
          for(const [key, value] of Object.entries(texts)){
            if(Array.isArray(value)){
              for(const [k,v] of Object.entries(value)){
                if(Number(k) > 0 && Number(k) < 2){
                   const elsobekezdes = this.htmlconvertService.convertToHtml(v.attributes.field_content.value);
                   this.elsob = elsobekezdes;
                }
          
              }
            }
          }
        });
  }
*/
}

