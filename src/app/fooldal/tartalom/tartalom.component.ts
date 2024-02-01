import { Component, ElementRef, Renderer2, SecurityContext } from '@angular/core';
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
  baseUrl: string = "https://baba.datastep.solutions:8443";
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
            //console.log(v.path.alias);
            if(v.title === 'Főoldal'){
              this.fooldalService.getFooldal(v.id).subscribe((page) =>{
                for(const [key, value] of Object.entries(page)){
                  for(var k in value.field_paragraphs){
                    console.log(value.field_paragraphs[k]);
                    const obj = {content: "" as SafeHtml, img_url: "", img_layout: "", 
                    text_condensed: "" as SafeHtml, button_content: "" as SafeHtml, 
                    text_highlighted_content: "" as SafeHtml, video: "", video_thumbnail:"",  video_360: "", video_720: "", video_1080: "",
                    img_alt:"", img_blue_alt: "", youtube_video: "",
                    alignmentSettings: {
                      isCenterText: false,
                      isJustifiedText: false,
                      isRightText: false,
                      isLeftText: false
                    },
                    textColorSettings: {
                      isPink: false,
                      isBlue: false,
                      isItalic: false
                    }
                  };
                    if(value.field_paragraphs[k].type === 'paragraph--image_full'){
                      obj.img_url = this.baseUrl + value.field_paragraphs[k].field_image_full.field_media_image.uri.url;
                      obj.img_alt = value.field_paragraphs[k].field_image_full.field_media_image.meta.alt
                    }else if(value.field_paragraphs[k].type === 'paragraph--image_text_blue'){
                      obj.content = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                      if(value.field_paragraphs[k].field_image_inline.field_media_image){
                        obj.img_url = this.baseUrl + value.field_paragraphs[k].field_image_inline.field_media_image.uri.url;
                        obj.img_blue_alt =  value.field_paragraphs[k].field_image_inline.field_media_image.meta.alt;
                      }
                      obj.img_layout = value.field_paragraphs[k].field_layout;
                    }else if(value.field_paragraphs[k].type === 'paragraph--text'){
                      console.log(value.field_paragraphs[k]);
                      const alignment = value.field_paragraphs[k].field_alignment;
    
                      obj.alignmentSettings = {
                        isCenterText: alignment === 'align-center',
                        isJustifiedText: alignment === 'align-justified',
                        isRightText: alignment === 'align-right',
                        isLeftText: alignment === 'align-left'
                    };

                      const textColor = value.field_paragraphs[k].field_format;
                      obj.textColorSettings = {
                        isPink: textColor === 'color-pink',
                        isBlue: textColor === 'color-blue',
                        isItalic: textColor === 'style-italic'

                    };

                      if(value.field_paragraphs[k].field_content !== undefined){
                        const paragraph_value = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                        obj.content = paragraph_value;
                      }
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
                      console.log(value.field_paragraphs[k].field_video);
                      obj.video = this.baseUrl + value.field_paragraphs[k].field_video.field_media_video_file.uri.url
                      obj.video_thumbnail = this.baseUrl + value.field_paragraphs[k].field_video.field_thumbnail.field_media_image.uri.url;
                      obj.video_360 = this.baseUrl + value.field_paragraphs[k].field_video.field_converted_360p.uri.url;
                      obj.video_720 = this.baseUrl + value.field_paragraphs[k].field_video.field_converted_720p.uri.url;
                      obj.video_1080 = this.baseUrl + value.field_paragraphs[k].field_video.field_converted_1080p.uri.url;
                    }else if (value.field_paragraphs[k].type === 'paragraph--youtube_video') {
                      const videoId = this.extractVideoId(value.field_paragraphs[k].field_youtube_video.field_media_oembed_video);
                      obj.youtube_video = "https://www.youtube.com/embed/" + videoId
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

