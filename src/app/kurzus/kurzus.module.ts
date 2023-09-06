import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KurzusComponent } from './kurzus/kurzus.component';
import { KurzusRoutingModule } from './kurzus-routing.modul';



@NgModule({
  declarations: [
    KurzusComponent
  ],
  imports: [
    CommonModule,
    KurzusRoutingModule
  ]
})
export class KurzusModule { }
