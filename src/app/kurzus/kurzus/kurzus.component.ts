import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';
import { SafeHtml } from '@angular/platform-browser';
import { ElofizetesComponent } from 'src/app/elofizetes/elofizetes/elofizetes.component';
import { SharedService } from 'src/app/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  choosedCourse: any;
  courseTitle: string = '';
  toggleLesson(index: number): void {
    this.lessonStates[index] = !this.lessonStates[index];
  }


  extractVideoId(url: string): string | null {
    const regex = /[?&]v=([^&#]*)/i;
    const match = regex.exec(url);
    return match ? match[1] : null;
  }

  constructor(private fooldalService: FooldalService,
    private htmlconvertService: HtmlconvertService,
    private shared: SharedService,
    private router: ActivatedRoute) { }

  ngOnInit(): void {
    
    this.courseTitle = this.router.snapshot.params['title'];
    console.log(this.courseTitle);
    this.fooldalService.getCoursesId().subscribe((cids: string[]) => {
      for (const cid of cids) {
        this.fooldalService.enrolledUserOutline(cid).subscribe((out) => {
          for (const [key, v] of Object.entries(out)) {
            if (v.title != undefined && v.title[0].value != this.router.snapshot.params['title']) {
              continue;
            }
            if (key === 'outline') {
              console.log(key,v);
              for (let i in v) {
                const obj = {
                  tema_title: "",
                  tema_description: "",
                  completed: false,
                  lessons: [] as {
                    lessons_title: string, lessons_desc: SafeHtml, y_video_url: string, text: string,
                    video_url: string, video_url_360: string, video_url_720: string, video_url_1080: string
                  }[]

                };
                //console.log(v[i]);
                if (v[i].node.hasOwnProperty("title")) {
                  obj.tema_title = v[i].node.title[0].value;
                }
                if (v[i].node.hasOwnProperty("body") && v[i].node.body.length > 0) {
                  obj.tema_description = v[i].node.body[0].value;

                }
                // Ellenőrizzük, hogy v[i].lessons[j].fulfillment.complete tömb létezik és nem üres
                if (Array.isArray(v[i].fulfillment.complete)) {
                  obj.completed = v[i].fulfillment.complete.length > 0; // True, ha nem üres
                }
                if (Array.isArray(v[i].lessons)) {
                  //console.log(v[i].fulfillment.complete);
                  for (let j in v[i].lessons) {
                    const lesson_obj = {
                      lessons_title: '',
                      lessons_desc: '' as SafeHtml,
                      y_video_url: '',
                      text: '',
                      video_url: '',
                      video_url_360: '',
                      video_url_720: '',
                      video_url_1080: '',
                      thumbnail: ''
                    }
                    lesson_obj.lessons_title = v[i].lessons[j].lesson.field_label[0].value;
                    const field_c = this.htmlconvertService.convertToHtml(v[i].lessons[j].lesson.field_content[0].value);
                    lesson_obj.lessons_desc = field_c;
                    const baseUrl = this.fooldalService.getBaseUrl();
                    if (v[i].lessons[j].thumbnail !== null) {
                      lesson_obj.thumbnail = baseUrl + v[i].lessons[j].thumbnail
                    }


                    if (v[i].lessons[j].video_url !== null && !v[i].lessons[j].video_url.startsWith('/sites')) {
                      const y_video = this.extractVideoId(v[i].lessons[j].video_url);
                      lesson_obj.y_video_url = "https://www.youtube.com/embed/" + y_video;
                      //console.log(obj.y_video_url);
                    }

                    if (v[i].lessons[j].video_url !== null && v[i].lessons[j].video_url.startsWith('/sites')) {
                      lesson_obj.video_url = baseUrl + v[i].lessons[j].video_url;
                      lesson_obj.video_url_360 = baseUrl + v[i].lessons[j].video_url_360p;
                      lesson_obj.video_url_720 = baseUrl + v[i].lessons[j].video_url_720p;
                      lesson_obj.video_url_1080 = baseUrl + v[i].lessons[j].video_url_1080p;
                      /*
                      console.log(obj.video_url);
                      console.log(obj.video_url_360);
                      console.log(obj.video_url_720);
                      console.log(obj.video_url_1080);
                      */
                    }
                    obj.lessons.push(lesson_obj);
                    // 
                  }
                  //console.log(this.block);
                }
                this.block.push(obj);
              }
              console.log(this.block);
            }

          }
        });
      }
    });

  }


  toggleLessons() {
    this.showLessons = !this.showLessons;
  }
}
