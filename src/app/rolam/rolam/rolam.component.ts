import { Component, SecurityContext} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Page } from 'src/app/models/Page';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';

@Component({
  selector: 'app-rolam',
  templateUrl: './rolam.component.html',
  styleUrls: ['./rolam.component.css']
})
export class RolamComponent {
  content: any[] = [];
  baseUrl: string = "https://baba.jrdatashu.win";
  isTextCondensed: boolean = false;
  isTextBackgroundGreen: boolean = false;

  constructor(private fooldalService: FooldalService, private htmlconvertService: HtmlconvertService, private sanitizer: DomSanitizer){}

  extractVideoId(url: string): string | null {
    const regex = /[?&]v=([^&#]*)/i;
    const match = regex.exec(url);
    return match ? match[1] : null;
  }

  ngOnInit(){
    this.fooldalService.getId().subscribe((i) => {
      for(const [key, value] of Object.entries(i)){
        if(Array.isArray(value)){
          for(const [k,v] of Object.entries(value)){
            //console.log(k,v);
            //console.log(v.path.alias);
            if(v.title === 'Rólam'){
              this.fooldalService.getFooldal(v.id).subscribe((page) =>{
                for(const [key, value] of Object.entries(page)){
                  for(var k in value.field_paragraphs){
                    console.log(value.field_paragraphs[k]);
                    const obj = {content: "" as SafeHtml, img_url: "", img_layout: "", youtube_video: "",text_condensed: "" as SafeHtml, button_content: "" as SafeHtml, text_highlighted_content: "" as SafeHtml, video:"", video_thumbnail:""};
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
                    }else if(value.field_paragraphs[k].type === 'paragraph--youtube_video'){
                      const videoId = this.extractVideoId(value.field_paragraphs[k].field_youtube_video.field_media_oembed_video);
                      obj.youtube_video = "https://www.youtube.com/embed/"+ videoId
                    }else if(value.field_paragraphs[k].type === 'paragraph--text_condensed'){
                      const paragraph_condensed = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                      obj.text_condensed = paragraph_condensed;
                      if(obj.text_condensed){
                        this.isTextCondensed = true;
                      }else{
                        this.isTextCondensed = false;
                      } 
                    }else if(value.field_paragraphs[k].type === 'paragraph--button'){
                      const button_value = value.field_paragraphs[k].field_content.value;
                      const buttonValueAsText: string = this.sanitizer.sanitize(SecurityContext.HTML, button_value) || '';
                      const buttonContentWithoutPTags = buttonValueAsText.replace(/<\/?p[^>]*>/g, '');
                      const buttonContentTrimmed = buttonContentWithoutPTags.trim();
                      obj.button_content = this.sanitizer.bypassSecurityTrustHtml(buttonContentTrimmed);
                    }else if(value.field_paragraphs[k].type === 'paragraph--text_highlighted'){
                      const highlighted_value = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                      obj.text_highlighted_content = highlighted_value;
                      if(obj.text_highlighted_content){
                        this.isTextBackgroundGreen = true;
                      }else{
                        this.isTextBackgroundGreen = false;
                      } 
                    }else if(value.field_paragraphs[k].type === 'paragraph--video'){
                      obj.video = this.baseUrl + value.field_paragraphs[k].field_video.field_media_video_file.uri.url;
                      obj.video_thumbnail = this.baseUrl + value.field_paragraphs[k].field_video.thumbnail.uri.url;

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
