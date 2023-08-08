import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FbpComponent } from './fbp/fbp.component';
import { FoglalkozasokbpRoutingModule } from './foglalkozasokbp-routing.module';
import { VideoPlayerComponent } from '../shared/video-player/video-player.component';


@NgModule({
  declarations: [
    FbpComponent,
    VideoPlayerComponent,
  ],
  imports: [
    CommonModule,
    FoglalkozasokbpRoutingModule,
    
  ]
})
export class FoglalkozasokbpModule { }
