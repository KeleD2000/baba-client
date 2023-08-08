import {Component, ElementRef, Input, ViewChild } from '@angular/core';
import  videojs from 'video.js';
@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent {
  @ViewChild('target', {static: true}) target!: ElementRef;

  @Input() options?: {
    fluid: boolean,
    aspectRatio: string,
    autoplay: boolean,
    poster: string,
    sources: {
        src: string,
        type: string,
    }[],
  };
  player!: videojs.Player



  ngOnInit() {
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this);
      this.one("loadedmetadata", () => {
        console.log(this.tech);
      });
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
