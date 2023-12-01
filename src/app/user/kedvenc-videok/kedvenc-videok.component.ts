import { Component } from '@angular/core';
import { FooldalService } from 'src/app/services/fooldal.service';
import { faCircle, faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart, faArrowAltCircleDown, faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-kedvenc-videok',
  templateUrl: './kedvenc-videok.component.html',
  styleUrls: ['./kedvenc-videok.component.css']
})
export class KedvencVideokComponent {
  isButtonActive: string = 'kedvenc';
  favoriteVideos: any[] = [];
  faArrowD = faArrowAltCircleDown;
  faArrowUp = faArrowAltCircleUp;
  faRegularHeart = faRegularHeart;
  faSolidHeart = faSolidHeart;
  baseUrl: string = "https://baba.datastep.solutions:8443";
  isArrow: boolean = false;
  likedData: any = {};

  constructor(private fooldalService: FooldalService) { }

  toggleTextOverflow(vid: any) {
    vid.isTextOverflow = !vid.isTextOverflow;
    this.isArrow = !this.isArrow;
  }

  toggleLike(video: any) {
    video.isLiked = !video.isLiked;
  
    const index = this.favoriteVideos.findIndex((v) => v.mid === video.mid);
    if (index !== -1) {
      this.favoriteVideos.splice(index, 1); // Az elem eltávolítása a tömbből
    }
  
    const likedData = {
      "entity_type": "media",
      "entity_id": video.mid,
      "flag_id": "favorite_videos"
    };
  
    this.fooldalService.likedVideos(likedData).subscribe(liked => {
      console.log(likedData);
      console.log(liked);
    });
  }  
  

  toggleButtonState(buttonId: any) {
    if (this.isButtonActive === buttonId) {
      this.isButtonActive = '';
    } else {
      this.isButtonActive = buttonId;
    }
  }

  extractVideoId(url: string): string | null {
    const regex = /[?&]v=([^&#]*)/i;
    const match = regex.exec(url);
    return match ? match[1] : null;
  }

  ngOnInit() {
    this.fooldalService.getFavoritesVideos().subscribe(v => {
      for (const [key, value] of Object.entries(v)) {
        console.log(key, value);
        const obj =
        {
          name: '',
          isLiked: false, // Hozzáadja az isLiked tulajdonságot minden elemhez
          y_video_url: "",
          video_url: "",
          video_url_360p: "",
          video_url_720p: "",
          video_url_1080p: "",
          thumbnail: "",
          mid: 0
        }
        obj.name = value.name;
        
        if (value.field_media_oembed_video) {
          const videoId = this.extractVideoId(value.field_media_oembed_video);
          obj.y_video_url = "https://www.youtube.com/embed/" + videoId;
          // Az alábbiakat töröld ki, ha nem akarsz más videókat megjeleníteni
          obj.video_url = "";
          obj.video_url_360p = "";
          obj.video_url_720p = "";
          obj.video_url_1080p = "";
          obj.thumbnail = "";
        } else {
          obj.y_video_url = "";
          obj.video_url = this.baseUrl + value.field_media_video_file;
          obj.video_url_360p = this.baseUrl + value.field_converted_360p;
          obj.video_url_720p = this.baseUrl + value.field_converted_720p;
          obj.video_url_1080p = this.baseUrl + value.field_converted_1080p;
          obj.thumbnail = value.thumbnail;
        }
        obj.mid = value.mid;
        this.favoriteVideos.push(obj);
      }
    });
    console.log(this.favoriteVideos);
  }
}
