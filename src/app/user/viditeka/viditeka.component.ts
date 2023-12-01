import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { faCircle, faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart, faArrowAltCircleDown, faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';


@Component({
  selector: 'app-viditeka',
  templateUrl: './viditeka.component.html',
  styleUrls: ['./viditeka.component.css']
})
export class ViditekaComponent {
  favoriteVideos: any[] = [];
  objCat: any[] = [];
  objVid: any[] = [];
  selectedCategories: any[] = [];
  activeCategoryIndex: number = -1;
  faCirc = faCircle;
  faArrowD = faArrowAltCircleDown;
  faArrowUp = faArrowAltCircleUp;
  faRegularHeart = faRegularHeart;
  faSolidHeart = faSolidHeart;
  baseUrl: string = "https://baba.datastep.solutions:8443";
  isLiked: boolean = false;
  isArrow: boolean = false;
  isButtonActive: string = 'napi';
  isItFavorite: boolean = false;
  likedData: any = {};
  buttonChange: string = '';
  partialCatDesc: string = ''; // Az első 5 sor a kategória szövegéből
  isFullCatDescVisible: boolean = false;
  showFullCatDesc: boolean = false; // Zászló a teljes kategória leírásának megjelenítéséhez
  showSummary: boolean = false;


  constructor(private fooldalService: FooldalService, private htmlConvert: HtmlconvertService, private sanitizer: DomSanitizer) {

  }

  toggleCatDesc() {
    this.showFullCatDesc = !this.showFullCatDesc;

    // Az új változó beállítása az aktuális tartalom alapján
    this.showSummary = !this.showFullCatDesc;
  }


  showCatImage(index: number) {
    this.activeCategoryIndex = index;
    const catImageContainer = document.getElementById('catImageContainer');
    if (catImageContainer) {
      catImageContainer.style.display = 'block';
    }
  }

  hideCatImage() {
    this.activeCategoryIndex = -1;
    const catImageContainer = document.getElementById('catImageContainer');
    if (catImageContainer) {
      catImageContainer.style.display = 'none';
    }
  }


  handleCategoryClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'LI') {
      // Itt kezeld a kattintást, csak ha a <li> elemre kattintottak
      const index = this.objCat.findIndex(cat => cat.catTitle === target.innerText);
      this.toggleCategory(this.objCat[index], index);
    }
  }

  toggleTextOverflow(lesson: any) {
    lesson.isTextOverflow = !lesson.isTextOverflow;

  }

  isTextOverflowing(lesson: any) {
    const textContainer = document.createElement('div');
    textContainer.innerHTML = lesson.lessons_desc;
    document.body.appendChild(textContainer);
    const isOverflowing = textContainer.scrollHeight > 118;
    document.body.removeChild(textContainer);
    return isOverflowing;
  }

  toggleLike() {
    this.isLiked = !this.isLiked;
    this.fooldalService.getFavoritesVideos().subscribe(v => {
      this.favoriteVideos.push(v);
      for (let i in this.favoriteVideos) {
        console.log(this.favoriteVideos[i]);
        if (this.favoriteVideos[i].length <= 10) {
          this.fooldalService.likedVideos(this.likedData).subscribe(liked => {
            console.log(this.likedData);
            console.log(liked);
          });
        } else {
          console.log("Error");
        }
      }
    });
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
      this.partialCatDesc = '';
      this.isFullCatDescVisible = false;
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
        // Ellenőrizzük, hogy van-e videó az adott kategóriához
        if (v && Object.keys(v).length > 0) {
          var objVid = {
            vidTitle: '',
            vidDesc: '' as SafeHtml,
            video_url: '',
            video_url_360: '',
            video_url_720: '',
            video_url_1080: '',
            thumbnail: '',
            mid: 0,
            isTextOverflow: true,
            showButton: ''
          }
          for (const [key, value] of Object.entries(v)) {
            console.log(value);
            /*
            objVid.vidTitle = value.videostore.title[0].value;
            let desc = value.videostore.body[0].value;
            */
            if (value.videostore.title.length > 0) {
              objVid.vidTitle = value.videostore.title[0].value;
            }
            if (value.videostore.body.length > 0) {
              var desc = value.videostore.body[0].value;
            }
            objVid.vidDesc = this.sanitizer.bypassSecurityTrustHtml(desc);
            objVid.video_url = this.baseUrl + value.video_url;
            objVid.video_url_360 = this.baseUrl + value.video_url_360p;
            objVid.video_url_720 = this.baseUrl + value.video_url_720p;
            objVid.video_url_1080 = this.baseUrl + value.video_url_1080p;
            objVid.mid = value.media.mid[0].value;
            objVid.thumbnail = this.baseUrl + value.thumbnail;

          }



          this.objVid = [objVid]; // Frissítsd az objVid tömböt

          this.likedData = {
            "entity_type": "media",
            "entity_id": objVid.mid,
            "flag_id": "favorite_videos"

          }
          console.log(this.objVid);
        } else {
          this.objVid = []; // Nincs videó az adott kategóriához, üres tömb
        }

        this.fooldalService.getFavoritesVideos().subscribe(fav => {
          for (const [k, v] of Object.entries(fav)) {
            console.log(v.mid);
            if (Number(v.mid) === objVid.mid) {
              this.isItFavorite = true;
            }
          }
        })
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
              catSummary: '' as SafeHtml,
              catDesc: '' as SafeHtml,
              photo_id: '',
              photo_url: '',
              weight: 0,
              tid: 0
            };
            obj.weight = value[i].attributes.weight;
            obj.photo_id = value[i].relationships.field_category_image.data.id;
            console.log(value[i].attributes.field_description.processed);
            console.log(value[i].attributes.field_description.summary);
            let desc = value[i].attributes.field_description.processed;
            obj.catDesc = this.sanitizer.bypassSecurityTrustHtml(desc);
            let sum = value[i].attributes.field_description.summary;
            // A sum értékét először szanitizáljuk, majd egy p tage-be helyezzük
            obj.catSummary = this.sanitizer.bypassSecurityTrustHtml(`<p>${sum}</p>`);


            obj.tid = value[i].attributes.drupal_internal__tid;
            obj.catTitle = value[i].attributes.name;
            this.objCat.push(obj);
            this.fooldalService.catPhotos(obj.photo_id).subscribe(p => {
              for (const [key, value] of Object.entries(p)) {
                if (value.attributes != undefined) {
                  obj.photo_url = this.baseUrl + value.attributes.uri.url;
                }
              }

            });
          }
        }

        // Rendezd a tömböt a weight property alapján
        this.objCat.sort((a, b) => a.weight - b.weight);
        console.log(this.objCat);

        this.showSummary = true;
      }
    });
  }

}