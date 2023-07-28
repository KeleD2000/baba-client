import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolamComponent } from './rolam/rolam.component';
import { RolamRoutingModule } from './rolam-routing.module';



@NgModule({
  declarations: [
    RolamComponent
  ],
  imports: [
    CommonModule,
    RolamRoutingModule
  ]
})
export class RolamModule { }
