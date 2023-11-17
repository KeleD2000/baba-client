import { Component } from '@angular/core';
import { FooldalService } from 'src/app/services/fooldal.service';

@Component({
  selector: 'app-gyik',
  templateUrl: './gyik.component.html',
  styleUrls: ['./gyik.component.css']
})
export class GyikComponent {
  faq: any[] = [];

  constructor(private fooldalService: FooldalService){}

  ngOnInit(){
    this.fooldalService.getFaqCat().subscribe(faq => {
      for (const [key, value] of Object.entries(faq)) {
        if (key === 'data') {
          for (let i in value) {
            var objFaqCat = {
              titleCat: value[i].attributes.name,
              id: value[i].id,
              isOpen: false // Az elem alapértelmezés szerint zárva van
            };
            this.faq.push(objFaqCat);
          }
        }
      }
      console.log(this.faq);
    });

    this.fooldalService.getFaqNode().subscribe( q => {
      for(const [kk, vv] of Object.entries(q)){
        if(kk === 'data'){
          for(let j in vv){
            for(let k in this.faq){
              if(this.faq[k].id === vv[j].relationships.field_faq_category.data.id){
                console.log(vv[j].attributes);
                
              }
            }
          }
        }
      }
    })
    
  }

  toggleFaq(index: number) {
    // Változtasd meg az isOpen értékét az index alapján
    this.faq[index].isOpen = !this.faq[index].isOpen;
  }

}
