import { Component, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-videotar',
  templateUrl: './videotar.component.html',
  styleUrls: ['./videotar.component.css']
})
export class VideotarComponent {
  categories: any[] = [];
  faTrash =  faTrash;

  showModal: boolean = false;

  uploadForm: FormGroup;

  video!: File;

  constructor(private fooldalService: FooldalService,
    private htmlconvetrService: HtmlconvertService,
    private renderer: Renderer2) {
      this.uploadForm = new FormGroup(
        {
          video: new FormControl(''),
          thumbnail: new FormControl(''),
          title: new FormControl(''),
          description: new FormControl('')
        }
      )
 }

  openModal() {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
    this.showModal = true;
    this.renderer.addClass(document.body, 'no-scroll');
  }

  closeModal() {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
    }
    this.showModal = false;
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  ngOnInit() {
    this.fooldalService.getCatNames().subscribe(catData => {
      for (const [key, value] of Object.entries(catData)) {
        for (const k in value) {
          for (const j in value[k]) {
            const cat = value[k][j];
            if (cat.name !== undefined) {
              const obj = this.createCategoryObject(cat);
              this.populateRotation(obj);
              this.populateVideos(obj);
              this.categories.push(obj);
            }
          }
        }
      }
      this.sortCategories();
    });
  }

  createCategoryObject(cat: any): any {
    const description = cat.description ? this.htmlconvetrService.convertToHtml(cat.description.value) : '';
    return {
      drupal_internal_revision_id: cat.drupal_internal__revision_id,
      title: cat.name,
      description: description,
      rotation: [] as { title: string; weight: string; videos: {url: string, iframe: boolean, video_title: string, description: string }[]}[],
    };
  }


  populateRotation(obj: any): void {
    this.fooldalService.getRotation().subscribe(rotationData => {
      for (const [key, rotation] of Object.entries(rotationData)) {
        if (key === "data") {
          for (const k in rotation) {
            obj.rotation.push({
              title: rotation[k].attributes.name,
              weight: rotation[k].attributes.weight,
              videos: []
            });
          }
        }
      }
    });
  }

  populateVideos(obj: any): void {
    this.fooldalService.getVideos().subscribe(videoData => {
      for (const [key, videos] of Object.entries(videoData)) {
        if (key === "data") {
          for (const k in videos) {
            const video = videos[k];
            if (video.field_category.name === obj.title) {
              const findedRotation = obj.rotation.find((i: any) => i.title === video.field_rotation.name);
              if (findedRotation) {
                
                if(video.field_video.type === "paragraph--youtube_video"){
                  const videoId = this.extractVideoId(video.field_video.field_youtube_video.field_media_oembed_video);
                  findedRotation.videos.push({url: "https://www.youtube.com/embed/"+ videoId, iframe: true, title: video.title, description:  this.htmlconvetrService.convertToHtml(video.body.value)});
                }else{
                  const baseUrl = this.fooldalService.getBaseUrl();
                  findedRotation.videos.push({url: baseUrl + video.field_video.field_video.field_media_video_file.uri.url, iframe: false,title: video.title, description:  this.htmlconvetrService.convertToHtml(video.body.value)});
                }
              }
            }
          }
        }
      }
    });
  }

  sortCategories(): void {
    this.categories.sort((a, b) => a.drupal_internal_revision_id - b.drupal_internal_revision_id);
  }

  extractVideoId(url: string): string | null {
    const regex = /[?&]v=([^&#]*)/i;
    const match = regex.exec(url);
    return match ? match[1] : null;
  }

  onFileSelected(event: any) {
    this.video = event.target.files[0];
  }

  /*onUpload(){
    console.log("szar");
    if(this.video && this.uploadForm.valid){
      const formData = new FormData();
      formData.append('file', this.video, this.video.name);
      const data = {
        data: {
          type: "media--video",
          attributes: {
            "status": true,
            "name": this.uploadForm.get('title')?.value
          },
          field_media_video_file: {
            data: {
              meta: {
                "description": this.uploadForm.get('description')?.value
              }
            }
          }
        }
      }
      this.fooldalService.createMedia(data).subscribe((response) => {
        if(response){
          for(const [key, value] of Object.entries(response)){
            if(key === 'data'){
              this.fooldalService.sendFile(formData, this.video?.name as string, value.id).subscribe((res) => {
                console.log(res);
              });
            }
          }
        }
      });
    }  
  }*/
  async onUpload() {
    if (this.video && this.uploadForm.valid) {
      console.log(this.video);
      const formData = new FormData();
      formData.append('file', this.video, this.video.name);
      console.log(formData);
      const data = {
        data: {
          type: "media--video",
          attributes: {
            "status": true,
            "name": this.uploadForm.get('title')?.value
          },
          field_media_video_file: {
            data: {
              meta: {
                "description": this.uploadForm.get('description')?.value
              }
            }
          }
        }
      }
      try{
        const createMedia = await this.fooldalService.createMedia(data).toPromise();
        if(createMedia){
          for (const [key, value] of Object.entries(createMedia)) {
            if (key === "data") {
              const sendFile = await this.fooldalService.sendFile(formData, this.video?.name as string, value.id).toPromise();
              console.log(sendFile);
             /* const createThumbnail = await this.fooldalService.createThumbnail(thumbnailData, this.thumbnail.name as string, value.id).toPromise();
              console.log(createThumbnail);*/
            }
          }
        }
      }catch(error){
        console.error('Error uploading media:', error);
      }
      
    }
  }
}
