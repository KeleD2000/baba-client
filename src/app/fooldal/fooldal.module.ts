import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'
import { FooldalRoutingModule } from './fooldal-routing.module';
import { TartalomComponent } from './tartalom/tartalom.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FooldalRoutingModule
  ],
  declarations: [
    TartalomComponent
  ],
})
export class FooldalModule { }
