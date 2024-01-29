import { Component, Input, NgZone } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';
import { SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { VideoStatusService } from 'src/app/services/video-status.service';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

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
  completed: any[] = [];
  videoIds: any[] = [];
  lessonColor: string = 'darkgray';
  visible: boolean = false;
  downArrow = faArrowDown;
  upArrow = faArrowUp;
  private currentLesson: any[] = [];
  private isFirstFalseAfterTrue: boolean = true;
  public videoEnded?: boolean;
  private obj = {
    tema_title: '',
    tema_description: '',
    lessons: [] as {}[]
  };
  firstBlock: boolean = true;



  constructor(private fooldalService: FooldalService,
    private htmlconvertService: HtmlconvertService,
    private router: ActivatedRoute,
    private videoStatusService: VideoStatusService,
    private zone: NgZone
  ) {

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


  getLessonColor(current: boolean): string {
    let lessonColor: string;
    if (current === true) {
      this.isFirstFalseAfterTrue = true;
      lessonColor = '#0A606F';
      this.visible = true;
    } else if (current === false && this.isFirstFalseAfterTrue) {
      this.isFirstFalseAfterTrue = false;
      lessonColor = '#E6009F';
      this.visible = true;
    } else if (current === false) {
      lessonColor = '#808080';
      this.visible = false;
    } else {
      lessonColor = '#808080';
      this.visible = false;
    }
    return lessonColor;
  }

  toggleLesson(index: number): void {
    this.lessonStates[index] = !this.lessonStates[index];
  }


  extractVideoId(url: string): string | null {
    const regex = /[?&]v=([^&#]*)/i;
    const match = regex.exec(url);
    return match ? match[1] : null;
  }

  ngOnInit(): void {
    this.courseTitle = this.router.snapshot.params['title'];
    this.fooldalService.getCourses().subscribe(crouse => {
      for (const [key, value] of Object.entries(crouse)) {
        if (key === 'courses') {
          for (let i in value) {
            if (this.courseTitle === value[i].title[0].value) {
              console.log(value[i].cid[0].value);
              this.fooldalService.enrolledUserOutline(value[i].cid[0].value).subscribe((out) => {
                console.log(out);
                for (const [key, v] of Object.entries(out)) {
                  if (v.title != undefined && v.title[0].value != this.router.snapshot.params['title']) {
                    continue;
                  }
                  if (key === 'outline') {
                    this.firstBlock = true;
                    for (let i in v) {
                      console.log(v[i]);
                      this.obj = {
                        tema_title: "",
                        tema_description: "",
                        lessons: [] as {}[]

                      };
                      console.log(v[i]);
                      if (v[i].node.hasOwnProperty("title")) {
                        this.obj.tema_title = v[i].node.title[0].value;
                      }
                      if (v[i].node.hasOwnProperty("body") && v[i].node.body.length > 0) {
                        this.obj.tema_description = v[i].node.body[0].value;

                      }

                      if (Array.isArray(v[i].lessons)) {
                        console.log(v[i]);
                        this.checkAndSetVideoEnded(v[i]);
                        if (v[i].lessons.length > 0) {
                          this.currentLesson.push(v[i]);
                          console.log(this.currentLesson);
                        }

                      }
                      this.block.push(this.obj);
                      console.log(this.block);
                    }

                    //console.log(this.block);
                    this.block.forEach(element => {
                      //console.log(element.lessons);
                      for (let i in element.lessons) {

                        this.completed.push(element.lessons[i].completed);
                      }
                    });
                  }

                }
              });
            }
          }
        }
      }
    })


    console.log(this.currentLesson);
  }

  async onLessonInfoClick(event: Event): Promise<void> {
    const clickedElement = event.target as HTMLElement;
    if (clickedElement.tagName === 'A' && this.currentLesson.length > 0) {
      let patchExecuted = false; // Új változó a patch művelet végrehajtásának nyilvántartására
      const lessonsToPatch = [];

      for (let k in this.currentLesson) {
        for (let j in this.currentLesson[k].lessons) {
          const lesson = this.currentLesson[k].lessons[j];
          console.log(lesson.fulfillment);

          // Csak azokat a leckéket tároljuk el, ahol a feltétel teljesül
          if (lesson.fulfillment.complete.length <= 0) {
            lessonsToPatch.push(lesson);
          }
        }

        // Ha van olyan lecke, amit patchelni kell, kilépünk mindkét ciklusból
        if (lessonsToPatch.length > 0) {
          patchExecuted = true;
          break;
        }
      }

      // Patch műveletet csak akkor hajtjuk végre, ha van olyan lecke, amit patchelni kell
      if (patchExecuted) {
        const firstLessonToPatch = lessonsToPatch[0];
        const watchedBody = {
          "data": {
            "type": "course_object_fulfillment--course_object_fulfillment",
            "id": firstLessonToPatch.fulfillment.uuid[0].value,
            "attributes": {
              "complete": true
            }
          }
        };

        // Várjuk meg a patchelést, csak az első megfelelő leckére
        console.log(firstLessonToPatch);
        console.log(watchedBody);
        await this.fooldalService.patchVideoWatched(watchedBody, firstLessonToPatch.fulfillment.uuid[0].value).toPromise();

        window.location.reload();
      }
    }
  }


  private checkAndSetVideoEnded(vElement: any): void {
    let firstMatch = true;
    let videoEndedSubscription: Subscription;

    for (let j in vElement.lessons) {
      if (!firstMatch) {
        break; // Ha már talált egyezést, ne menjen tovább
      }
    }

    for (let j in vElement.lessons) {

      const lesson_obj = {
        video_id: '',
        lessons_title: '',
        lessons_desc: '' as SafeHtml,
        completed: false,
        y_video_url: '',
        text: '',
        video_url: '',
        video_url_360: '',
        video_url_720: '',
        video_url_1080: '',
        video_ended: false,
        thumbnail: '',
        isTextOverflow: true,
      };

      videoEndedSubscription = this.videoStatusService.videoEnded$.subscribe((videoEnded) => {
        this.videoEnded = videoEnded;
        console.log('videoEnded változás:', videoEnded);
        console.log(vElement.fulfillment.complete);
        if (vElement.lessons[j].fulfillment !== null) {
          if (firstMatch && lesson_obj.video_id !== '' && !lesson_obj.completed && this.videoEnded && this.firstBlock) {
            console.log('videoEnded változás:', this.videoEnded);
            lesson_obj.video_ended = true;
            console.log(lesson_obj);
            console.log(vElement.lessons[j].fulfillment.uuid[0].value);
            const watchedBody = {
              "data": {
                "type": "course_object_fulfillment--course_object_fulfillment",
                "id": vElement.lessons[j].fulfillment.uuid[0].value,
                "attributes": {
                  "complete": true
                }
              }
            }
            this.fooldalService.patchVideoWatched(watchedBody, vElement.lessons[j].fulfillment.uuid[0].value).subscribe(v => {
              console.log(v);
              window.location.reload();
            })

            this.videoEnded = false;
            firstMatch = false;
            this.firstBlock = false;
            videoEndedSubscription.unsubscribe();
          }
        }

      });

      lesson_obj.lessons_title = vElement.lessons[j].lesson.field_label[0].value;
      const field_c = this.htmlconvertService.convertToHtml(vElement.lessons[j].lesson.field_content[0].value);
      lesson_obj.lessons_desc = field_c;
      const baseUrl = this.fooldalService.getBaseUrl();

      if (vElement.lessons[j].lesson.field_video) {
        lesson_obj.video_id = vElement.lessons[j].lesson.id[0].value;
      }

      if (vElement.lessons[j].fulfillment) {
        if (Array.isArray(vElement.lessons[j].fulfillment.complete)) {
          lesson_obj.completed = vElement.lessons[j].fulfillment.complete.length > 0;
        } else {
          lesson_obj.completed = false;
        }

        if (vElement.lessons[j].thumbnail !== null) {
          lesson_obj.thumbnail = baseUrl + vElement.lessons[j].thumbnail;
        }
      }

      if (vElement.lessons[j].video_url !== null && !vElement.lessons[j].video_url.startsWith('/sites')) {
        const y_video = this.extractVideoId(vElement.lessons[j].video_url);
        lesson_obj.y_video_url = 'https://www.youtube.com/embed/' + y_video;
      }

      if (vElement.lessons[j].video_url !== null && vElement.lessons[j].video_url.startsWith('/sites')) {
        lesson_obj.video_url = baseUrl + vElement.lessons[j].video_url;
        lesson_obj.video_url_360 = baseUrl + vElement.lessons[j].video_url_360p;
        lesson_obj.video_url_720 = baseUrl + vElement.lessons[j].video_url_720p;
        lesson_obj.video_url_1080 = baseUrl + vElement.lessons[j].video_url_1080p;
      }

      this.obj.lessons.push(lesson_obj);
    }
  }


  toggleLessons() {
    this.showLessons = !this.showLessons;
  }
}
