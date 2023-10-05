import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViditekaComponent } from './viditeka/viditeka.component';
import { UserRoutingModule } from './user-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';




@NgModule({
  declarations: [
    ViditekaComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FontAwesomeModule,
    SharedModule
  ]
})
export class UserModule { }
