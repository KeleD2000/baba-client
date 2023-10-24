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
  baseUrl: string = "https://baba.jrdatashu.win";
  isLiked: boolean = false;
  isArrow: boolean = false;
  isButtonActive: string = 'napi';
  likedData: any = {};
  buttonChange: string = '';
  partialCatDesc: string = ''; // Az első 5 sor a kategória szövegéből
  isFullCatDescVisible: boolean = false;
  showFullCatDesc: boolean = false; // Zászló a teljes kategória leírásának megjelenítéséhez


  constructor(private fooldalService: FooldalService, private htmlConvert: HtmlconvertService, private sanitizer: DomSanitizer) {

  }

  toggleShowFullCatDesc() {
    this.showFullCatDesc = !this.showFullCatDesc;
  }

  convertSafeHtmlToString(safeHtml: SafeHtml): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, safeHtml) || '';
  }

  truncateCatDescription(fullText: any) {
    const safeHtml: SafeHtml = fullText; // itt állítod be a safeHtml értékét
    const catDescString = this.sanitizer.sanitize(SecurityContext.HTML, safeHtml) || ''; // SafeHtml-et szöveggé alakítunk

    const paragraphs = catDescString.split('<p>'); // Szöveget osztunk párafolyamatokra
    let firstFiveLines = ''; // Az első 5 sor tartalma
    let lineCount = 0;

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      const lines = paragraph.split('\n');
      for (let j = 0; j < lines.length; j++) {
        const line = lines[j];
        if (lineCount >= 5) {
          break; // Már elértük az első 5 sort
        }

        firstFiveLines += line + '\n';
        lineCount++;
      }

      if (lineCount >= 5) {
        break; // Már elértük az első 5 sort
      }
    }

    // További logikád (HTML-eltávolítás, tömörítés) ide jön

    // Végül a firstFiveLines tartalmát rendeled a partialCatDesc változóhoz
    this.partialCatDesc = firstFiveLines;
    console.log(this.partialCatDesc);
  }

  showCatImage(index: number) {
    this.activeCategoryIndex = index;
    const catImageContainer = document.getElementById('catImageContainer');
    if (catImageContainer) {
      catImageContainer.style.display = 'block';
    }

    if (this.activeCategoryIndex >= 0) {

      this.truncateCatDescription(String(this.objCat[this.activeCategoryIndex].catDesc));
      console.log(this.truncateCatDescription);
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

  toggleTextOverflow(vid: any) {
    vid.isTextOverflow = !vid.isTextOverflow;
  }
  
  isTextOverflowing(vid: any) {
    const textContainer = document.querySelector('.lesson-info') as HTMLElement;
    if (textContainer) {
      return textContainer.scrollHeight > 115;
    }
    return false; // Vagy visszatérj hamis értékkel, ha a textContainer nem található
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
    /*
    this.fooldalService.likedVideos(this.likedData).subscribe( liked => {
      console.log(this.likedData);
      console.log(liked);
    })*/
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
      this.truncateCatDescription(cat.catDesc);
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

        // Ellenőrizzük, hogy van-e videó az adott kategóriához
        if (v && Object.keys(v).length > 0) {
          const objVid = {
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
            objVid.vidTitle = value.videostore.title[0].value;
            let desc = value.videostore.body[0].value;
            objVid.vidDesc = this.sanitizer.bypassSecurityTrustHtml(desc);
            objVid.video_url = this.baseUrl + value.video_url;
            objVid.video_url_360 = this.baseUrl + value.video_url_360p;
            objVid.video_url_720 = this.baseUrl + value.video_url_720p;
            objVid.video_url_1080 = this.baseUrl + value.video_url_1080p;
            objVid.mid = value.media.mid[0].value;
            //objVid.thumbnail = this.baseUrl + value.thumbnail;

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
                  obj.photo_url = this.baseUrl + value.attributes.uri.url;
                }
              }
            });
          }
        }
      }
    });

  }
}