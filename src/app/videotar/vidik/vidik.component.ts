import { Component } from '@angular/core';
import { Page } from 'src/app/models/Page';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';

@Component({
  selector: 'app-vidik',
  templateUrl: './vidik.component.html',
  styleUrls: ['./vidik.component.css']
})
export class VidikComponent {
  content: any[] = [];

  getPhotos(i: any){
    switch(i){
      case 0 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/4Videoteka6.jpeg";
      case 2 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/4Videoteka2.jpg";
      case 4 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/4Videoteka5.jpeg";
      case 6 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/4Videoteka7.jpeg";
      case 9 : return "http://baba.jrdatashu.win/sites/default/files/2023-07/Logo_WhiteBIGbackground_main.png";
      default : return '';
    }
  }

  constructor(private fooldalService: FooldalService, private htmlconvertService: HtmlconvertService){

  }

  ngOnInit(){
    this.fooldalService.getId().subscribe((i) => {
      for(const [key, value] of Object.entries(i)){
        if(Array.isArray(value)){
          for(const [k,v] of Object.entries(value)){
            const page: Page = {page: v.title, id: v.id};
            if(page.page === 'Videótár'){
              this.fooldalService.getFooldal(page.id).subscribe((page) =>{
                for(const [key, value] of Object.entries(page)){
                  for(var k in value.field_paragraphs){
                    if(value.field_paragraphs[k].field_content !== undefined){
                      const paragraph_value = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                      this.content.push(paragraph_value);
                      if(value.field_paragraphs[k].type === 'paragraph--image_text_blue'){
                        var kk = Number(k);
                        this.content.splice(kk+=2, 0, undefined);

                      }
                    }else{
                      this.content.push(undefined);
                    }
                  }
                }
                this.swapAndLogContent(2, 3);
                this.swapAndLogContent(4, 5);
                this.swapAndLogContent(7, 8);
                this.swapAndLogContent(8, 9);
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
