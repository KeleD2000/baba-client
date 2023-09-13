import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LombikraComponent } from './lombikra/lombikra.component';
import { LombikrafelkeszitokurzusRoutingModule } from './lombikrafelkeszitokurzus-routing.module';
import { SharedModule } from "../shared/shared.module";



@NgModule({
    declarations: [
        LombikraComponent
    ],
    imports: [
        CommonModule, LombikrafelkeszitokurzusRoutingModule,
        SharedModule
    ]
})
export class LombikrafelkeszitokurzusModule { }
