import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { FooldalService } from '../services/fooldal.service';



@NgModule({
  declarations: [
    VideoPlayerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [VideoPlayerComponent],
  providers: [
    FooldalService

  ]
})
export class SharedModule { }
