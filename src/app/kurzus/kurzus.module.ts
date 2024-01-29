import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KurzusComponent } from './kurzus/kurzus.component';
import { KurzusRoutingModule } from './kurzus-routing.modul';
import { SharedModule } from '../shared/shared.module';
import { KurzussafePipe } from '../pipes/kurzussafe.pipe';
import { KurzusoldalComponent } from './kurzusoldal/kurzusoldal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';





@NgModule({
  declarations: [
    KurzusComponent,
    KurzussafePipe,
    KurzusoldalComponent

  ],
  imports: [
    CommonModule,
    KurzusRoutingModule,
    SharedModule,
    FontAwesomeModule
  ]
})
export class KurzusModule { }
