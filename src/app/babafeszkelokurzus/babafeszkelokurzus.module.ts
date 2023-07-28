import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BabafeszkeloComponent } from './babafeszkelo/babafeszkelo.component';
import { BabafeszkelokurzusRoutingModule } from './babafeszkelokurzus-routing.module';



@NgModule({
  declarations: [
    BabafeszkeloComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BabafeszkelokurzusRoutingModule
  ]
})
export class BabafeszkelokurzusModule { }
