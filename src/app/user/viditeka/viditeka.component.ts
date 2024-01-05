import { Component, Renderer2, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { faCircle, faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart, faArrowAltCircleDown, faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-viditeka',
  templateUrl: './viditeka.component.html',
  styleUrls: ['./viditeka.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(300)]),
      transition(':leave', animate(300, style({ opacity: 0 })))
    ])
  ]
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
  isArrow: boolean = false;
  isButtonActive: string = 'napi';
  isItFavorite: boolean = false;
  likedData: any = {};
  loginError?: string;
  showLoginAlert: boolean = false;
  buttonChange: string = '';
  partialCatDesc: string = ''; // Az első 5 sor a kategória szövegéből
  isFullCatDescVisible: boolean = false;
  showModal: boolean = false;
  modalTitle: string = '';
  modalContent: string = '';
  showFullCatDesc: boolean = false; // Zászló a teljes kategória leírásának megjelenítéséhez
  showSummary: boolean = false;


  constructor(private fooldalService: FooldalService, private htmlConvert: HtmlconvertService,
    private sanitizer: DomSanitizer, private renderer: Renderer2
  ) {

  }

  closeModal() {
    const modal1 = document.getElementById('exampleModal1');
    if (modal1) {
      modal1.style.display = 'none';
      modal1.classList.remove('show');
    }
    this.showModal = false;
    this.renderer.removeClass(document.body, 'no-scroll');
    window.location.reload();
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

  toggleLike(videoNid: number) {
    const videoIndex = this.objVid.findIndex(vid => vid.nid === videoNid);
    if (videoIndex !== -1) {
      this.objVid[videoIndex].isLiked = !this.objVid[videoIndex].isLike
      this.likedData = {
        "entity_type": "node",
        "entity_id": videoNid,
        "flag_id": "favorite_videostore"

      }
      this.fooldalService.getFavoritesVideos().subscribe(v => {
        this.favoriteVideos.push(v);
        for (let i in this.favoriteVideos) {
          if (this.favoriteVideos[i].length <= 10) {
            this.fooldalService.likedVideos(this.likedData).subscribe(liked => {
              console.log(liked);
            }, error => {
              if (error.status === 422) {
                this.loginError = error.error.message;
              }
              const modal1 = document.getElementById('exampleModal1');
              if (modal1) {
                modal1.style.display = 'block';
                modal1.classList.add('show');
              }
              this.showModal = true; 
              this.renderer.addClass(document.body, 'no-scroll');
              if(this.loginError){
                this.modalTitle = "Elérted a maximálisan beállítható videó mennyiségét";
              }
            });
          } else {
            console.log("Error");
          }
        }
      });
    }
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
    this.objVid = [];
    if (this.activeCategoryIndex >= 0) {
      const selectedCategory = this.objCat[this.activeCategoryIndex];
      this.fooldalService.getCurrentVideos(selectedCategory.tid).subscribe((v) => {
        // Ellenőrizzük, hogy van-e videó az adott kategóriához
        console.log(v);

        if (v && Object.keys(v).length > 0) {
          for (const [key, value] of Object.entries(v)) {
            var objVid = {
              vidTitle: '',
              vidDesc: '' as SafeHtml,
              video_url: '',
              video_url_360: '',
              video_url_720: '',
              video_url_1080: '',
              thumbnail: '',
              mid: 0,
              nid: 0,
              isTextOverflow: true,
              showButton: '',
              isLiked: false,
              isItFavorite: false
            }
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
            objVid.nid = value.videostore.nid[0].value
            objVid.thumbnail = this.baseUrl + value.thumbnail;
            console.log(objVid);
            this.objVid.push(objVid);
            console.log(this.objVid);
          }
          this.fooldalService.getFavoritesVideos().subscribe(fav => {
            for (const [k, v] of Object.entries(fav)) {
              for (let i in this.objVid) {
                console.log(this.objVid[i].nid);
                if (Number(v.nid) === this.objVid[i].nid) {
                  this.objVid[i].isItFavorite = true;

                }
              }
            }
          });




        } else {
          this.objVid = []; // Nincs videó az adott kategóriához, üres tömb
        }
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

        this.showSummary = true;
      }
    });
  }

}