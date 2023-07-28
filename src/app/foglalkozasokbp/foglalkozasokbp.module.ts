import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FbpComponent } from './fbp/fbp.component';
import { FoglalkozasokbpRoutingModule } from './foglalkozasokbp-routing.module';



@NgModule({
  declarations: [
    FbpComponent
  ],
  imports: [
    CommonModule,
    FoglalkozasokbpRoutingModule
  ]
})
export class FoglalkozasokbpModule { }
