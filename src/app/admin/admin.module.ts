import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideotarComponent } from './videotar/videotar.component';
import { AdminRoutingModule } from './admin-routing.module';



@NgModule({
  declarations: [
    VideotarComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
