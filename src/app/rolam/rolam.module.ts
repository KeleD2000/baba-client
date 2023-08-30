import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolamComponent } from './rolam/rolam.component';
import { RolamRoutingModule } from './rolam-routing.module';
import { SafePipe } from '../pipes/safe.pipe';



@NgModule({
  declarations: [
    RolamComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    RolamRoutingModule
  ]
})
export class RolamModule { }
