import { DatePipe } from '@angular/common';
import { format, parseISO, isEqual, isBefore, isAfter } from 'date-fns';
import { ChangeDetectorRef, Component, ElementRef, Renderer2, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';

@Component({
  selector: 'app-fbp',
  templateUrl: './fbp.component.html',
  styleUrls: ['./fbp.component.css']
})

export class FbpComponent {
  content: any[] = [];
  hallProducts: any[] = [];
  hallProductsMaps: any[] = [];
  baseUrl: string = "https://baba.datastep.solutions";
  isTextCondensed: boolean = false;
  isTextBackgroundGreen: boolean = false;
  showModal1: boolean = false;
  showModal2: boolean = false;
  modalTitle1: string = '';
  modalTitle2: string = '';
  modalContent1: string = '';
  modalContent2: string = '';
  isLoggedIn: boolean = false;
  private hallSubscription: Subscription | undefined;

  constructor(private fooldalService: FooldalService, private datePipe: DatePipe,
    private htmlconvertService: HtmlconvertService, private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2) { }

  extractVideoIdAndTime(url: string): { videoId: string | null, time: string | null } {
    const videoIdRegex = /[?&]v=([^&#]*)/i;
    const timeRegex = /[?&]t=([^&#]*)/i;

    const videoIdMatch = videoIdRegex.exec(url);
    const timeMatch = timeRegex.exec(url);

    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    const time = timeMatch ? timeMatch[1] : null;

    return { videoId, time };
  }

  isLastItem(index: number): boolean {
    return index === this.hallProducts.length - 1;
  }

  openPayModal() {
    const modal1 = document.getElementById('exampleModal1');
    if (modal1) {
      modal1.style.display = 'block';
      modal1.classList.add('show');
    }

    this.showModal1 = true;
    this.renderer.addClass(document.body, 'no-scroll');

    this.modalTitle1 = 'Előjegyzés';

  }

  openBookModal() {
    const modal2 = document.getElementById('exampleModal2');
  
    if (modal2) {
      modal2.style.display = 'block';
      modal2.classList.add('show');
    }
  
    this.showModal2 = true; // Módosítás itt
  
    this.renderer.addClass(document.body, 'no-scroll');

    this.modalTitle1 = 'Facebook';
  }
  

  closeModal(modalNumber: number) {
    const modal1 = document.getElementById('exampleModal1');
    const modal2 = document.getElementById('exampleModal2');

    if (modal1 && modal2) {
      modal1.style.display = 'none';
      modal1.classList.remove('show');
      modal2.style.display = 'none';
      modal2.classList.remove('show');
    }

    this.showModal1 = false;
    this.showModal2 = false;
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  ngOnInit() {
    const isUserLoggedIn = localStorage.getItem('login');
    if(isUserLoggedIn){
      this.isLoggedIn = true;
      console.log(this.isLoggedIn);
    }else{
      this.isLoggedIn = false;
      console.log(this.isLoggedIn);
    }

    this.fooldalService.getId().subscribe((i) => {
      for (const [key, value] of Object.entries(i)) {
        if (Array.isArray(value)) {
          for (const [k, v] of Object.entries(value)) {
            if (v.title === 'Foglalkozások teremben') {
              this.fooldalService.getFooldal(v.id).subscribe((page) => {
                for (const [key, value] of Object.entries(page)) {
                  for (var k in value.field_paragraphs) {
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
                    } else if (value.field_paragraphs[k].type === 'paragraph--youtube_video') {
                      const videoId = this.extractVideoIdAndTime(value.field_paragraphs[k].field_youtube_video.field_media_oembed_video).videoId;
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

    this.fooldalService.getHallSessionProduct().subscribe(hall => {
      for (const [key, value] of Object.entries(hall)) {
        if (key === 'data') {
          for (let i in value) {
            console.log(value[i]);
            const hallObj = {
              title: '',
              place: '',
              lat: 0,
              long: 0,
              date: '',
              desc: '' as SafeHtml,
              max_member: '',
              price: '',
              is_booked: false,
              is_can_pay: false
            }
            hallObj.title = value[i].title;
            hallObj.place = value[i].field_location.field_label;
            let rawDate = value[i].field_date;
            let formattedDate = rawDate ? this.datePipe.transform(rawDate, 'yyyy.MM.dd. – HH:mm') : '';
            hallObj.date = formattedDate || ''
            let converted = this.htmlconvertService.convertToHtml(value[i].body.value);
            hallObj.desc = converted;
            hallObj.max_member = value[i].variations[0].field_headcount.available_stock;
            hallObj.price = value[i].variations[0].price.formatted;
            let coord = value[i].field_location.field_address;
            const coordSplit = coord.split(',');
            const NumberLat = Number(coordSplit[0]);
            const NumberLong = Number(coordSplit[1]);
            const todayDate: string = format(new Date(), 'yyyy.MM.dd');
            const onlyDate: string = formattedDate ? formattedDate.split(' – ')[0] : '';
            const convertedTodayDate = format(new Date(todayDate), 'yyyy-MM-dd');
            const convertedOnlyDate = format(new Date(onlyDate), 'yyyy-MM-dd');
            const convertTodayDate = parseISO(convertedTodayDate);
            const convertOnlyDate = parseISO(convertedOnlyDate);
            console.log(convertTodayDate);
            console.log(convertOnlyDate);
            if (isEqual(convertOnlyDate, convertTodayDate) || isBefore(convertOnlyDate, convertTodayDate)) {
              hallObj.is_can_pay = true
            } else if (isAfter(convertOnlyDate, convertTodayDate)) {
              hallObj.is_booked = true;
            }
            hallObj.lat = NumberLat;
            hallObj.long = NumberLong;
            this.hallProducts.push(hallObj);
            localStorage.setItem('hall', JSON.stringify(this.hallProducts));
            this.cdr.detectChanges();
          }
        }
      }
    });
    console.log(this.hallProducts)
  }

  ngOnDestroy() {
    // Leiratkozás a hallSubscription-ról, hogy elkerüljük a memórialeakokat
    if (this.hallSubscription) {
      this.hallSubscription.unsubscribe();
    }
  }
}
