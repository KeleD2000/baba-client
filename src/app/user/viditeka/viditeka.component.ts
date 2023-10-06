import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { faCircle, faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import {faHeart as faSolidHeart, faArrowAltCircleDown, faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';

@Component({
  selector: 'app-viditeka',
  templateUrl: './viditeka.component.html',
  styleUrls: ['./viditeka.component.css']
})
export class ViditekaComponent {
  objCat: any[] = [];
  objVid: any[] = [];
  selectedCategories: any[] = [];
  activeCategoryIndex: number = -1;
  faCirc = faCircle;
  faArrowD = faArrowAltCircleDown;
  faArrowUp = faArrowAltCircleUp;
  faRegularHeart = faRegularHeart;
  faSolidHeart = faSolidHeart;
  baseUrl: string = "https://baba.jrdatashu.win";
  isLiked = false;
  isArrow = false;
  isButtonActive: string = 'napi';

  constructor(private fooldalService: FooldalService, private htmlConvert: HtmlconvertService, private sanitizer: DomSanitizer) {

  }

  handleCategoryClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'LI') {
      // Itt kezeld a kattintást, csak ha a <li> elemre kattintottak
      const index = this.objCat.findIndex(cat => cat.catTitle === target.innerText);
      this.toggleCategory(this.objCat[index], index);
    }
  }
  
  
  toggleTextOverflow(vid: any) {
    vid.isTextOverflow = !vid.isTextOverflow;
    this.isArrow = !this.isArrow;
  }  

  toggleLike() {
    this.isLiked = !this.isLiked;
  }

  toggleButtonState(buttonId: any) {
    if (this.isButtonActive === buttonId) {
      this.isButtonActive = ''; 
    } else {
      this.isButtonActive = buttonId;
    }
  }

  isCategoryActive(cat: any): boolean {
    return this.isButtonActive === cat.catTitle;
  }

  toggleCategory(cat: any, index: number) {
    if (this.isButtonActive === cat.catTitle) {
      this.isButtonActive = '';
      this.activeCategoryIndex = -1;
    } else {
      this.isButtonActive = cat.catTitle;
      this.activeCategoryIndex = index;
    }

    this.objCat.forEach((c, i) => {
      c.isActive = i === this.activeCategoryIndex;
    });
  }


  showImage(cat: any) {
    cat.isImageVisible = true;
  }

  hideImage(cat: any) {
    cat.isImageVisible = false;
  }
  loadRecommendedVideos() {
    if (this.activeCategoryIndex >= 0) {
      const selectedCategory = this.objCat[this.activeCategoryIndex];
      this.fooldalService.getCurrentVideos(selectedCategory.tid).subscribe((v) => {
        console.log(v);
        const objVid = {
          vidTitle: '',
          vidDesc: '' as SafeHtml,
          video_url: '',
          video_url_360: '',
          video_url_720: '',
          video_url_1080: '',
          thumbnail: '',
          isTextOverflow: false,
          showArrow: false
        }
        for (const [key, value] of Object.entries(v)) {
          objVid.vidTitle = value.videostore.title[0].value;
          let desc = value.videostore.body[0].value;
          objVid.vidDesc = this.sanitizer.bypassSecurityTrustHtml(desc);
          objVid.video_url = this.baseUrl + value.video_url;
          objVid.video_url_360 = this.baseUrl + value.video_url_360p;
          objVid.video_url_720 = this.baseUrl + value.video_url_720p;
          objVid.video_url_1080 = this.baseUrl + value.video_url_1080p;
          //objVid.thumbnail = this.baseUrl + value.thumbnail;

        }

        if (this.objVid = []) {
          this.objVid.push(objVid);
        } else {
          this.objVid = [];
        }
        console.log(this.objVid);
      });
    }
  }


  ngOnInit() {
    this.fooldalService.getCatNames().subscribe(cat => {
      for (const [key, value] of Object.entries(cat)) {
        if (key === 'data') {
          for (let i in value) {
            const obj = {
              catTitle: '',
              catDesc: '' as SafeHtml,
              photo_id: '',
              photo_url: '',
              tid: 0
            };
            obj.photo_id = value[i].relationships.field_category_image.data.id;
            console.log(obj.photo_id);
            if (value[i].attributes.description != null) {
              let desc = value[i].attributes.description.value;
              obj.catDesc = this.sanitizer.bypassSecurityTrustHtml(desc);
            }
            obj.tid = value[i].attributes.drupal_internal__tid;
            obj.catTitle = value[i].attributes.name;
            this.objCat.push(obj);
            this.fooldalService.catPhotos(obj.photo_id).subscribe(p => {
              for (const [key, value] of Object.entries(p)) {
                if (value.attributes != undefined) {
                  console.log(this.baseUrl + value.attributes.uri.url);
                  obj.photo_url = this.baseUrl + value.attributes.uri.url;
                }
              }
            });
          }
        }
      }
      console.log(this.objCat);
    });
  }

}