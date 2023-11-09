import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { VideoStatusService } from 'src/app/services/video-status.service';
import videojs from 'video.js';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent {
  

  constructor(private videoStatusService: VideoStatusService){ }

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
      this.on('loadedmetadata', () => {
        this.on('ended', () => {
          const currentTime = this.currentTime();
          const duration = this.duration();
          self.videoStatusService.setVideoEnded(true); // Beállítja a videóállapotot
          console.log('Jelenlegi idő:', currentTime, 'Teljes idő:', duration);
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
