import { Component } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Page } from 'src/app/models/Page';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';

@Component({
  selector: 'app-lombikra',
  templateUrl: './lombikra.component.html',
  styleUrls: ['./lombikra.component.css']
})
export class LombikraComponent {
  content: any[] = [];
  baseUrl: string = "https://baba.jrdatashu.win";
  constructor(private fooldalService: FooldalService, private htmlconvertService: HtmlconvertService){}

  ngOnInit(){
    this.fooldalService.getId().subscribe((i) => {
      for(const [key, value] of Object.entries(i)){
        if(Array.isArray(value)){
          for(const [k,v] of Object.entries(value)){
            //console.log(k,v);
            //console.log(v.path.alias);
            if(v.title === 'Lombikra felkészítő kurzus'){
              this.fooldalService.getFooldal(v.id).subscribe((page) =>{
                for(const [key, value] of Object.entries(page)){
                  for(var k in value.field_paragraphs){
                    console.log(value.field_paragraphs[k]);
                    const obj = {content: "" as SafeHtml, img_url: "", img_layout: ""};
                    if(value.field_paragraphs[k].type === 'paragraph--image_full'){
                      obj.img_url = this.baseUrl + value.field_paragraphs[k].field_image_full.field_media_image.uri.url;
                    }else if(value.field_paragraphs[k].type === 'paragraph--image_text_blue'){
                      obj.content = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                      obj.img_url = this.baseUrl + value.field_paragraphs[k].field_image_inline.field_media_image.uri.url;
                      obj.img_layout = value.field_paragraphs[k].field_layout;
                    }else if(value.field_paragraphs[k].type === 'paragraph--text'){
                      if(value.field_paragraphs[k].field_content !== undefined){
                        const paragraph_value = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                        obj.content = paragraph_value;
                      }
                    }
                    this.content.push(obj);
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
