import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FbpComponent } from './fbp/fbp.component';
import { FoglalkozasokbpRoutingModule } from './foglalkozasokbp-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FbpsafePipe } from '../pipes/fbpsafe.pipe';
import { GoogleMapComponent } from '../components/google-map/google-map.component';



@NgModule({
  declarations: [
    FbpComponent,
    GoogleMapComponent,
    FbpsafePipe
  ],
  imports: [
    CommonModule,
    FoglalkozasokbpRoutingModule,
    SharedModule
  ],
  providers:[DatePipe]
})
export class FoglalkozasokbpModule { }
