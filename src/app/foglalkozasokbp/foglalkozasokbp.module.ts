import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FbpComponent } from './fbp/fbp.component';
import { FoglalkozasokbpRoutingModule } from './foglalkozasokbp-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FbpsafePipe } from '../pipes/fbpsafe.pipe';
import { GoogleMapComponent } from '../components/google-map/google-map.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FbpComponent,
    GoogleMapComponent,
    FbpsafePipe
  ],
  imports: [
    CommonModule,
    FoglalkozasokbpRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[DatePipe]
})
export class FoglalkozasokbpModule { }
