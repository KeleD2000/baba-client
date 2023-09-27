import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KurzusComponent } from './kurzus/kurzus.component';
import { KurzusRoutingModule } from './kurzus-routing.modul';
import { SharedModule } from '../shared/shared.module';
import { KurzussafePipe } from '../pipes/kurzussafe.pipe';
import { KurzusadatokComponent } from './kurzusadatok/kurzusadatok.component';




@NgModule({
  declarations: [
    KurzusComponent,
    KurzussafePipe,
    KurzusadatokComponent

  ],
  imports: [
    CommonModule,
    KurzusRoutingModule,
    SharedModule
  ]
})
export class KurzusModule { }
