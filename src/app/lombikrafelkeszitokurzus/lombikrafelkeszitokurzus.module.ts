import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LombikraComponent } from './lombikra/lombikra.component';
import { LombikrafelkeszitokurzusRoutingModule } from './lombikrafelkeszitokurzus-routing.module';



@NgModule({
  declarations: [
    LombikraComponent
  ],
  imports: [
    CommonModule,LombikrafelkeszitokurzusRoutingModule
  ]
})
export class LombikrafelkeszitokurzusModule { }
