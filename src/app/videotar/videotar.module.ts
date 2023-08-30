import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VidikComponent } from './vidik/vidik.component';
import { VideotarRoutingModule } from './videotar-routing.module';
import { SafePipe } from '../pipes/safe.pipe';



@NgModule({
  declarations: [
    VidikComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    VideotarRoutingModule
  ]
})
export class VideotarModule { }
