import { Component, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-videotar',
  templateUrl: './videotar.component.html',
  styleUrls: ['./videotar.component.css']
})
export class VideotarComponent {
  categories: any[] = [];
  faTrash = faTrash;
  errorMessage: string = '';

  showModal: boolean = false;

  uploadForm: FormGroup;

  video!: File;
  thumbnail!: File;

  uploadRotationId: any;
  uploadCategorieId: any;
  loggedUuid: any;
  spinner: boolean = false;
  videoFormatError?: string;
  thumbnailFormatError?: string;
  upload: boolean = false;
  constructor(private fooldalService: FooldalService,
    private htmlconvetrService: HtmlconvertService,
    private authService: AuthService,
    private renderer: Renderer2) {
    this.uploadForm = new FormGroup(
      {
        video: new FormControl('', [Validators.required]),
        thumbnail: new FormControl('', [Validators.required]),
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required])
      }
    )
  }

  openModal(categorie_id: any, rotation_id: any) {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
    this.uploadCategorieId = categorie_id;
    this.uploadRotationId = rotation_id;
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
    this.populateCategory();
    const loggedUserId = this.authService.getAuthenticatedUserID();
    this.authService.getUserId(loggedUserId).subscribe(response => {
      if (response) {
        for (const [key, value] of Object.entries(response)) {
          if (key === "data") {
            for (var k in value) {
              this.loggedUuid = value[k].id;
            }
          }
        }
      }
    });
  }

  populateCategory() {
    this.fooldalService.getCatNames().subscribe(catData => {
      for (const [key, value] of Object.entries(catData)) {
        for (const k in value) {
          for (const j in value[k]) {
            const cat = value[k][j];
            // console.log(cat);
            if (cat.name !== undefined) {
              const obj = this.createCategoryObject(cat, value[k].id);
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

  createCategoryObject(cat: any, categorie_id: any): any {
    const description = cat.description ? this.htmlconvetrService.convertToHtml(cat.description.value) : '';
    return {
      drupal_internal_revision_id: cat.drupal_internal__revision_id,
      id: categorie_id,
      title: cat.name,
      description: description,
      rotation: [] as { id: string, title: string; weight: string; videos: { id: string, url: string, iframe: boolean, video_title: string, description: string, thumbnail: string }[] }[],
    };
  }


  populateRotation(obj: any): void {
    this.fooldalService.getRotation().subscribe(rotationData => {
      for (const [key, rotation] of Object.entries(rotationData)) {
        if (key === "data") {
          for (const k in rotation) {
            obj.rotation.push({
              id: rotation[k].id,
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
            if (video.field_category.name === obj.title && Array.isArray(video.field_video)) {
              const findedRotation = obj.rotation.find((i: any) => i.title === video.field_rotation.name);
              if (findedRotation) {
                if (video.field_video[0].type === "paragraph--video") {
                  console.log(video.field_video[0]);
                  if (video.field_video[0].field_video.field_media_video_file != undefined) {
                      const baseUrl = this.fooldalService.getBaseUrl();
                      console.log(video.field_video[0].field_video.field_media_video_file.uri);
                      if(video.field_video[0].field_video.field_media_video_file.uri){
                        var video_url = baseUrl + video.field_video[0].field_video.field_media_video_file.uri.url;
                        var thumbnail;
                        if(video.field_video[0].field_video.field_thumbnail.field_media_image){
                          if (video.field_video[0].field_video.field_thumbnail.field_media_image.uri != undefined ) {
                            //Ha van thumbnail
                            
                            thumbnail = baseUrl + video.field_video[0].field_video.field_thumbnail.field_media_image.uri.url;
                          }
                        }
                        findedRotation.videos.push({ id: video.id, url: video_url, iframe: false, title: video.title, description: this.htmlconvetrService.convertToHtml(""), thumbnail: thumbnail })
                      }
                    
                    }
                } else if (video.field_video[0].type === "paragraph--youtube_video") {
                  //youtube video
                  const videoId = this.extractVideoId(video.field_video[0].field_youtube_video.field_media_oembed_video);
                  console.log(video.body.value);
                  if(video.body.value){
                    findedRotation.videos.push({ id: video.id, url: "https://www.youtube.com/embed/" + videoId, iframe: true, title: video.title, description: this.htmlconvetrService.convertToHtml(video.body.value) });
                  }
                  //findedRotation.videos.push({ id: video.id, url: "https://www.youtube.com/embed/" + videoId, iframe: true, title: video.title, description: this.htmlconvetrService.convertToHtml(video.body.value) });
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
    if (!this.fileFormatValidator(this.video.name)) {
      this.videoFormatError = "A fájl formátum csak .mp4 lehet!";
    } else {
      this.videoFormatError = ''
    }
  }

  fileFormatValidator(fileName: any): boolean {
    const validFormats = ['mp4', 'jpg'];
    if (fileName) {
      const fileExtension = fileName.split('.').pop().toLowerCase();
      if (validFormats.includes(fileExtension)) {
        return true
      }
    }
    return false;
  }

  onThumbnaiLSelected(event: any) {
    this.thumbnail = event.target.files[0];
    if (!this.fileFormatValidator(this.thumbnail.name)) {
      this.thumbnailFormatError = "A fájl formátum csak .jpg lehet!";
    } else {
      this.thumbnailFormatError = '';
    }
  }

  deleteVideos(videoId: string) {
    console.log(videoId);
    this.fooldalService.deleteVideos(videoId).subscribe(response => {
      console.log(response);
      this.categories = [];
      this.populateCategory();
    });
  }

  async onUpload() {
    if (!this.fileFormatValidator(this.video.name)) {
      this.videoFormatError = "A fájl formátum csak .mp4 lehet!";
      return;
    }
    if (!this.fileFormatValidator(this.thumbnail.name)) {
      this.thumbnailFormatError = "A fájl formátum csak .jpg lehet!";
      return;
    }
    if (this.video && this.thumbnail && this.uploadForm.valid) {
      console.log(this.video);
      console.log(this.thumbnail);
      this.upload = true;
      const formData = new FormData();
      formData.append('file', this.video, this.video.name);
      const thumbnailFormData = new FormData();
      thumbnailFormData.append('file', this.thumbnail, this.thumbnail.name);
      const data = {
        data: {
          type: "media--video",
          attributes: {
            "status": true,
            "name": this.uploadForm.get('title')?.value
          },
        }
      }
      const thumbnailData = {
        data: {
          type: "media--image",
          attributes: {
            status: true,
            name: this.thumbnail.name
          }
        }
      }

      const videoPatchData = {
        data: {
          type: "media--video",
          id: "",
          attributes: {
            status: true,
            name: this.uploadForm.get('title')?.value
          },
          relationships: {
            field_thumbnail: {
              data: [{
                type: "media--image",
                id: ""
              }]
            }
          }
        }
      }
      try {
        const createMediaVideo = await this.fooldalService.createMediaVideo(data).toPromise();
        const createThumbnail = await this.fooldalService.createThumbnail(thumbnailData).toPromise();
        console.log(createThumbnail);
        if (createMediaVideo) {
          for (const [key, value] of Object.entries(createMediaVideo)) {
            if (key === "data") {
              const sendVideoResponse = await this.fooldalService.sendVideo(formData, this.video?.name as string, value.id).toPromise();
              videoPatchData.data.id = value.id;
            }
          }
        }
        if (createThumbnail) {
          for (const [key, value] of Object.entries(createThumbnail)) {
            if (key === "data") {
              const sendThumbnailImage = await this.fooldalService.sendImage(thumbnailFormData, this.thumbnail.name as string, value.id).toPromise();
              console.log(sendThumbnailImage);
              videoPatchData.data.relationships.field_thumbnail.data[0].id = value.id;
            }
          }
        }
        const patchVideo = await this.fooldalService.patchVideo(videoPatchData, videoPatchData.data.id).toPromise();
        const paragraphData = {
          data: {
            type: "paragraph--video",
            attributes: {
              status: true
            },
            relationships: {
              field_video: {
                data: {
                  type: "media--video",
                  id: videoPatchData.data.id
                }
              }
            }
          }
        }
        const videoStoreData = {
          data: {
            type: "node--videostore",
            attributes: {
              status: true,
              title: this.uploadForm.get('title')?.value,
              body: {
                value: "<p>" + this.uploadForm.get('description')?.value + "</p>",
                format: "basic_html",
                summary: "string"
              },
              field_code: "teszt",
              field_weight: 0
            },
            relationships: {
              uid: {
                data: {
                  type: "user--user",
                  id: ""
                }
              },
              field_category: {
                data: {
                  type: "taxonomy_term--videostore_categories",
                  id: this.uploadCategorieId
                }
              },
              field_rotation: {
                data: {
                  type: "taxonomy_term--rotation",
                  id: this.uploadRotationId
                }
              },
              field_video: {
                data: [{
                  type: "paragraph--video",
                  id: "",
                  meta: {
                    target_revision_id: ""
                  }
                }]
              }
            }
          }
        }
        const paragraph = await this.fooldalService.createVideoParagraph(paragraphData).toPromise();
        if (paragraph) {
          for (const [key, value] of Object.entries(paragraph)) {
            if (key === "data") {
              videoStoreData.data.relationships.field_video.data[0].id = value.id;
              videoStoreData.data.relationships.field_video.data[0].meta.target_revision_id = value.attributes.drupal_internal__revision_id;
            }
          }
        }
        videoStoreData.data.relationships.uid.data.id = this.loggedUuid;
        const videoStore = await this.fooldalService.sendVideoStore(videoStoreData).toPromise();
        console.log(videoStore);
        if (videoStore) {
          this.upload = false;
          this.closeModal();
          this.uploadForm.reset();
          this.categories = [];
          this.populateCategory();

        }

      } catch (error) {
        console.error('Error uploading media:', error);
      }
    }
  }
}
