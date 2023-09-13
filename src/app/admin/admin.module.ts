import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideotarComponent } from './videotar/videotar.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SafePipe } from '../pipes/safe.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';


library.add(faTrash);

@NgModule({
  declarations: [
    VideotarComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ]
})
 


export class AdminModule { 
  constructor(library: FaIconLibrary){
    library.addIcons(faTrash);
  }
}
