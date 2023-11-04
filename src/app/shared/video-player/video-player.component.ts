import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import videojs from 'video.js';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent {

  constructor() { }

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
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      this.on('loadedmetadata', () => {
        // Tömb inicializálása, ha nincs még ilyen
        const videoIdString = localStorage.getItem('video_id');
        let videoId: any[] = videoIdString ? JSON.parse(videoIdString) : [];

        // Ellenőrizd, hogy van-e id a tömbben
        if (videoId.length > 0) {
          let currentVideoId = videoId[0];
          console.log('Az aktuális videóhoz rendelt id:', currentVideoId);

          this.on('timeupdate', () => {
            const currentTime = this.currentTime(); // A videó jelenlegi lejátszási ideje másodpercben
            const duration = this.duration(); // A videó teljes hossza másodpercben

            if (currentTime === duration) {
              currentVideoId = videoId.shift();
              let videoIds: any[] =[];
              console.log('Az aktuális videóhoz rendelt id:', currentVideoId);
              if(!videoIds.includes(currentVideoId)){
                videoIds.push(currentVideoId);
                console.log(videoIds);
              }

              // Frissítsd a localStorage-ban lévő tömböt, hogy az első elem nélkül folytathassad
              localStorage.setItem('video_id', JSON.stringify(videoId));
              console.log(videoId);

              // Ellenőrizd, hogy van-e még id a tömbben
              if (videoId.length > 0) {
                currentVideoId = videoId[0];
                console.log('A következő videóhoz rendelt id:', currentVideoId);
              }
            }

            console.log('Jelenlegi idő:', currentTime, 'Teljes idő:', duration);
          });
        }

        // Egyéb inicializáció és beállítások
        const qualitySelector = document.createElement('select');
        qualitySelector.style.background = 'transparent';
        qualitySelector.style.border = 'none';
        qualitySelector.style.color = 'white';
        this.controlBar.el().appendChild(qualitySelector);

        this.options_.sources?.forEach((source: any) => {
          const option = document.createElement('option');
          option.value = source.src;
          option.text = source.label;
          option.style.background = '#254350';
          qualitySelector.appendChild(option);
        });
        qualitySelector.addEventListener('change', (event: any) => {
          const selectedSrc = event.target.value;

          // Frissítsd a videoId tömböt a következő videó id-jével
          if (videoId.length > 0) {
            videoId.shift(); // Távolítsd el az aktuális videóhoz tartozó id-t
            localStorage.setItem('video_id', JSON.stringify(videoId)); // Frissítsd a localStorage-ban lévő tömböt
          }

          // Itt töltsd be a következő videót az új id alapján
          this.src(selectedSrc);
        });
      });
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
