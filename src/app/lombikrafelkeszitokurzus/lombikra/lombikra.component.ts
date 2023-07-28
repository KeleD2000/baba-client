import { Component } from '@angular/core';
import { Page } from 'src/app/models/page';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';

@Component({
  selector: 'app-lombikra',
  templateUrl: './lombikra.component.html',
  styleUrls: ['./lombikra.component.css']
})
export class LombikraComponent {
  content: any[] = [];

  getPhotos(i: any) {
    switch (i) {
      case 2: return "http://baba.jrdatashu.win/sites/default/files/2023-07/3Lombik1.jpeg";
      case 14: return "http://baba.jrdatashu.win/sites/default/files/2023-07/3Lombik3.jpeg";
      case 20: return "http://baba.jrdatashu.win/sites/default/files/2023-07/3Lombik2.jpeg";
      default: return '';
    }
  }

  constructor(private fooldalService: FooldalService, private htmlconvertService: HtmlconvertService) {

  }

  ngOnInit() {
    this.fooldalService.getId().subscribe((i) => {
      for (const [key, value] of Object.entries(i)) {
        if (Array.isArray(value)) {
          for (const [k, v] of Object.entries(value)) {
            const page: Page = { page: v.title, id: v.id };
            if (page.page === 'Lombikra felkészítő kurzus') {
              this.fooldalService.getFooldal(page.id).subscribe((page) => {
                for (const [key, value] of Object.entries(page)) {
                  for (var k in value.field_paragraphs) {
                    if (value.field_paragraphs[k].field_content !== undefined) {
                      const paragraph_value = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                      this.content.push(paragraph_value);
                      if (value.field_paragraphs[k].type === 'paragraph--image_text_blue') {
                        var kk = Number(k);
                        this.content.splice(kk += 2, 0, undefined);
                      }
                    } else {
                      this.content.push(undefined);
                    }
                  }
                }
                this.swapAndLogContent(14, 15); // Itt hívjuk meg a felcserélés metódust
              });
            }
          }
        }
      }
    });
  }
  
  swapAndLogContent(index1: number, index2: number) {
    // Ellenőrizzük, hogy a megadott indexek a tömb határain belül vannak-e
    if (index1 < 0 || index1 >= this.content.length || index2 < 0 || index2 >= this.content.length) {
      console.error("Érvénytelen indexek a felcseréléshez!");
      return;
    }
  
    // Felcseréljük az elemeket a tömbben
    const temp = this.content[index1];
    this.content[index1] = this.content[index2];
    this.content[index2] = temp;
  }
}
