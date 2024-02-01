import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BabafeszkeloComponent } from './babafeszkelo/babafeszkelo.component';
import { BabafeszkelokurzusRoutingModule } from './babafeszkelokurzus-routing.module';
import { SharedModule } from "../shared/shared.module";
import { BabafeszkelosafePipe } from '../pipes/babafeszkelosafe.pipe';



@NgModule({
    declarations: [
        BabafeszkeloComponent,
        BabafeszkelosafePipe
    ],
    imports: [
        CommonModule,
        RouterModule,
        BabafeszkelokurzusRoutingModule,
        SharedModule
    ]
})
export class BabafeszkelokurzusModule { }
