import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { VideoStatusService } from 'src/app/services/video-status.service';
import videojs from 'video.js';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent {
  constructor(private videoStatusService: VideoStatusService) {}

  @ViewChild('target', { static: true }) target!: ElementRef;

  @Input() options?: {
    fluid: boolean;
    aspectRatio: string;
    autoplay: boolean;
    poster: string;
    sources: {
      src: string;
      type: string;
      label: string;
    }[];
  };
  @Input() paddingTop: string = '0px';
  player!: videojs.Player;

  ngOnInit() {
    const self = this;
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      // Ellenőrizd, hogy van-e már minőségváltó a control bar-ban
      let qualitySelector = this.controlBar.el().querySelector('select');
  
      if (!qualitySelector) {
        // Ha nincs, akkor hozz létre egy select elemet a minőségváltáshoz
        qualitySelector = document.createElement('select');
        qualitySelector.style.background = 'transparent';
        qualitySelector.style.border = 'none';
        qualitySelector.style.color = 'white';
  
        // Adj hozzá a control bar-hoz
        this.controlBar.el().appendChild(qualitySelector);
  
        // Eseménykezelő a minőségváltásra
        this.options_.sources?.forEach((source: any) => {
          const option = document.createElement('option');
          option.value = source.src;
          option.text = source.label;
          option.style.background = '#254350';
          if(qualitySelector){
            qualitySelector.appendChild(option);
          }
        });
  
        qualitySelector.addEventListener('change', (event: any) => {
          const selectedSrc = event.target.value;
          this.src(selectedSrc);
        });
      }
  
      this.on('loadedmetadata', () => {
        // Eseménykezelő a minőségváltásra (opcionális, ha külön minőségváltó eseménykezelőre van szükség)
      });
  
      this.on('ended', () => {
        const currentTime = this.currentTime();
        const duration = this.duration();
        self.videoStatusService.setVideoEnded(true); // Beállítja a videóállapotot
        console.log('Jelenlegi idő:', currentTime, 'Teljes idő:', duration);
      });
    });
  }
  

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
