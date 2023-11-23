import { Component, ElementRef, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';

@Component({
  selector: 'app-fbp',
  templateUrl: './fbp.component.html',
  styleUrls: ['./fbp.component.css']
})

export class FbpComponent {
  content: any[] = [];
  baseUrl: string = "https://baba.datastep.solutions";
  isTextCondensed: boolean = false;
  isTextBackgroundGreen: boolean = false;

  constructor(private fooldalService: FooldalService, private htmlconvertService: HtmlconvertService, private sanitizer: DomSanitizer) { }

  extractVideoIdAndTime(url: string): { videoId: string | null, time: string | null } {
    const videoIdRegex = /[?&]v=([^&#]*)/i;
    const timeRegex = /[?&]t=([^&#]*)/i;
  
    const videoIdMatch = videoIdRegex.exec(url);
    const timeMatch = timeRegex.exec(url);
  
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    const time = timeMatch ? timeMatch[1] : null;
  
    return { videoId, time };
  }
  
  

  ngOnInit() {
    this.fooldalService.getId().subscribe((i) => {
      for (const [key, value] of Object.entries(i)) {
        if (Array.isArray(value)) {
          for (const [k, v] of Object.entries(value)) {
            if (v.title === 'Foglalkozások teremben') {
              this.fooldalService.getFooldal(v.id).subscribe((page) => {
                for (const [key, value] of Object.entries(page)) {
                  for (var k in value.field_paragraphs) {
                    console.log(value.field_paragraphs);
                    const obj = { content: '' as SafeHtml, youtube_video: "", img_url: "", img_layout: "", video_url: "", text_condensed: "" as SafeHtml, button_content: "" as SafeHtml, text_highlighted_content: "" as SafeHtml, video: "", video_thumbnail: "" }
                    if (value.field_paragraphs[k].type === 'paragraph--image_full') {
                      obj.img_url = this.baseUrl + value.field_paragraphs[k].field_image_full.field_media_image.uri.url;
                    } else if (value.field_paragraphs[k].type === 'paragraph--image_text_blue') {
                      obj.content = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                      obj.img_url = this.baseUrl + value.field_paragraphs[k].field_image_inline.field_media_image.uri.url;
                      obj.img_layout = value.field_paragraphs[k].field_layout;
                    } else if (value.field_paragraphs[k].type === 'paragraph--text') {
                      if (value.field_paragraphs[k].field_content !== undefined) {
                        const paragraph_value = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                        obj.content = paragraph_value;
                      }
                    } else if (value.field_paragraphs[k].type === 'paragraph--video') {
                      //obj.video_url = this.baseUrl + value.field_paragraphs[k].field_video.field_media_video_file.uri.url;
                    } else if (value.field_paragraphs[k].type === 'paragraph--text_condensed') {
                      const paragraph_condensed = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                      obj.text_condensed = paragraph_condensed;
                      if (obj.text_condensed) {
                        this.isTextCondensed = true;
                      } else {
                        this.isTextCondensed = false;
                      }
                    } else if (value.field_paragraphs[k].type === 'paragraph--button') {
                      const button_value = value.field_paragraphs[k].field_content.value;
                      const buttonValueAsText: string = this.sanitizer.sanitize(SecurityContext.HTML, button_value) || '';
                      const buttonContentWithoutPTags = buttonValueAsText.replace(/<\/?p[^>]*>/g, '');
                      const buttonContentTrimmed = buttonContentWithoutPTags.trim();
                      obj.button_content = this.sanitizer.bypassSecurityTrustHtml(buttonContentTrimmed);
                    } else if (value.field_paragraphs[k].type === 'paragraph--text_highlighted') {
                      const highlighted_value = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                      obj.text_highlighted_content = highlighted_value;
                      if (obj.text_highlighted_content) {
                        this.isTextBackgroundGreen = true;
                      } else {
                        this.isTextBackgroundGreen = false;
                      }
                    } else if (value.field_paragraphs[k].type === 'paragraph--video') {
                      obj.video = this.baseUrl + value.field_paragraphs[k].field_video.field_media_video_file.uri.url
                      obj.video_thumbnail = this.baseUrl + value.field_paragraphs[k].field_video.field_thumbnail.field_media_image.uri.url;
                    }else if(value.field_paragraphs[k].type === 'paragraph--youtube_video'){
                      console.log(value.field_paragraphs[k].field_youtube_video.field_media_oembed_video);
                      const videoId = this.extractVideoIdAndTime(value.field_paragraphs[k].field_youtube_video.field_media_oembed_video).videoId;
                      console.log(videoId);
                      obj.youtube_video = "https://www.youtube.com/embed/"+ videoId
                    }
                    this.content.push(obj);
                    console.log(this.content);

                  }
                }
              });
            }
          }
        }
      }
    });
  }
}
