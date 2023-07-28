import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VidikComponent } from './vidik/vidik.component';
import { VideotarRoutingModule } from './videotar-routing.module';



@NgModule({
  declarations: [
    VidikComponent
  ],
  imports: [
    CommonModule,
    VideotarRoutingModule
  ]
})
export class VideotarModule { }
