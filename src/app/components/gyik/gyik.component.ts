import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FooldalService } from 'src/app/services/fooldal.service';

@Component({
  selector: 'app-gyik',
  templateUrl: './gyik.component.html',
  styleUrls: ['./gyik.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(300)]),
      transition(':leave', animate(300, style({ opacity: 0 })))
    ])
  ]
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
              questions: [],
              isOpen: false // Az elem alapértelmezés szerint zárva van
            };
            this.faq.push(objFaqCat);
          }
        }
      }
      this.faq.forEach(category => {
        this.fooldalService.getScreeningQuestions(category.id).subscribe(q => {
          for(const [kk, vv] of Object.entries(q)){
            if(kk === 'data'){
              for(let j in vv){
                if(vv[j].attributes.title && vv[j].attributes.body){
                  category.questions.push({
                    question: vv[j].attributes.title,
                    answer: vv[j].attributes.body.value
                  })
                }
              }
            }
          }
        });
      });
    });
    console.log(this.faq);
  }

  toggleFaq(index: number) {
    this.faq[index].isOpen = !this.faq[index].isOpen;
  }
  

}
