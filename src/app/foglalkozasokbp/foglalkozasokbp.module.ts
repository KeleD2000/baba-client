import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FbpComponent } from './fbp/fbp.component';
import { FoglalkozasokbpRoutingModule } from './foglalkozasokbp-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FbpsafePipe } from '../pipes/fbpsafe.pipe';


@NgModule({
  declarations: [
    FbpComponent,
    FbpsafePipe
  ],
  imports: [
    CommonModule,
    FoglalkozasokbpRoutingModule,
    SharedModule
  ]
})
export class FoglalkozasokbpModule { }
