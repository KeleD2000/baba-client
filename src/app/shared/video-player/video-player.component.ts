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
        label: string
    }[],
  };
  @Input() paddingTop: string = '0px';
  player!: videojs.Player

  ngOnInit() {
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this);
      this.one("loadedmetadata", () => {
        console.log(this.tech);

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
