import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BabafeszkeloComponent } from './babafeszkelo/babafeszkelo.component';
import { BabafeszkelokurzusRoutingModule } from './babafeszkelokurzus-routing.module';
import { SharedModule } from "../shared/shared.module";



@NgModule({
    declarations: [
        BabafeszkeloComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        BabafeszkelokurzusRoutingModule,
        SharedModule
    ]
})
export class BabafeszkelokurzusModule { }
