import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';

@Component({
  selector: 'app-viditeka',
  templateUrl: './viditeka.component.html',
  styleUrls: ['./viditeka.component.css']
})
export class ViditekaComponent {
  objCat: any[] = [];
  selectedCategories: any[] = [];
  activeCategoryIndex: number = -1;
  faCirc = faCircle;

  constructor(private fooldalService: FooldalService, private htmlConvert: HtmlconvertService, private sanitizer: DomSanitizer){

  }
  
  isButtonActive: string = ''; // Most a string típusú változó lesz

  toggleButtonState(button: string) {
    if (this.isButtonActive === button) {
      this.isButtonActive = ''; // Ha a gomb ugyanarra kattintottak, visszaállítjuk az állapotot
    } else {
      this.isButtonActive = button; // Különben az új gombot állítjuk be aktívnak
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
  }
  
  

  ngOnInit() {
    this.fooldalService.getCatNames().subscribe(cat => {
      for (const [key, value] of Object.entries(cat)) {
        if (key === 'data') {
          for (let i in value) {
            const obj = { catTitle: '', catDesc: '' as SafeHtml };
            if (value[i].attributes.description != null) {
              let desc = value[i].attributes.description.value;
              // Cseréljük a <p> elemeket zárójelekre
              desc = this.replaceParagraphTagsWithBrackets(desc);
              obj.catDesc = this.sanitizer.bypassSecurityTrustHtml(desc);
            }
            obj.catTitle = value[i].attributes.name;
            this.objCat.push(obj);
          }
        }
      }
      console.log(this.objCat);
    });
  }
  
  replaceParagraphTagsWithBrackets(html: string): string {
    // Cseréljük a <p> elemeket () zárójelekre
    return html.replace(/<p>/g, '(').replace(/<\/p>/g, ')');
  }
  

}