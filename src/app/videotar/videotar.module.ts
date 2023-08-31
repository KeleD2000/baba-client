import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VidikComponent } from './vidik/vidik.component';
import { VideotarRoutingModule } from './videotar-routing.module';
import { VidisafePipe } from '../pipes/vidisafe.pipe';




@NgModule({
  declarations: [
    VidikComponent,
    VidisafePipe
  ],
  imports: [
    CommonModule,
    VideotarRoutingModule,
  ]
})
export class VideotarModule { }
