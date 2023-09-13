import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VidikComponent } from './vidik/vidik.component';
import { VideotarRoutingModule } from './videotar-routing.module';
import { VidisafePipe } from '../pipes/vidisafe.pipe';
import { SharedModule } from "../shared/shared.module";




@NgModule({
    declarations: [
        VidikComponent,
        VidisafePipe
    ],
    imports: [
        CommonModule,
        VideotarRoutingModule,
        SharedModule
    ]
})
export class VideotarModule { }
