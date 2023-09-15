import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-kurzus',
  templateUrl: './kurzus.component.html',
  styleUrls: ['./kurzus.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('collapsed <=> expanded', animate('200ms ease-out')),
    ]),
  ]
})
export class KurzusComponent {
  block: any[] = [];
  showLessons: boolean = false;
  lessonStates: boolean[] = [];

  toggleLesson(index: number): void {
    this.lessonStates[index] = !this.lessonStates[index];
  }

  constructor(private fooldalService: FooldalService, private htmlconvertService: HtmlconvertService){}

  ngOnInit(): void {
    this.fooldalService.enrolledUserOutline().subscribe((out) => {
      for (const [key, value] of Object.entries(out)) {
        if (key === 'outline') {
          for (let i in value) {
            if (Array.isArray(value[i].lessons) && value[i].lessons.length > 0) {
              for (let j in value[i].lessons) {
                const obj = { blockTitle: '', blockDesc: '' as SafeHtml };
  
                for (let h in value[i].lessons[j].lesson.field_label) {
                  obj.blockTitle = value[i].lessons[j].lesson.field_label[h].value;
                  console.log(obj.blockTitle);
                }
                for (let h in value[i].lessons[j].lesson.field_content) {
                  const field_c = this.htmlconvertService.convertToHtml(
                    value[i].lessons[j].lesson.field_content[h].value
                  );
                  obj.blockDesc = field_c;
                  console.log(obj.blockDesc);
                }
  
                this.block.push(obj);
              }
            }
          }
        }
      }
  
      console.log(this.block);
    });
  }
  
  

  toggleLessons(){
    this.showLessons = !this.showLessons;
  }
}
