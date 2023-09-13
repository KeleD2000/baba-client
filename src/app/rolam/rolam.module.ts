import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolamComponent } from './rolam/rolam.component';
import { RolamRoutingModule } from './rolam-routing.module';
import { RolamsafePipe } from '../pipes/rolamsafe.pipe';
import { SharedModule } from "../shared/shared.module";



@NgModule({
    declarations: [
        RolamComponent,
        RolamsafePipe
    ],
    imports: [
        CommonModule,
        RolamRoutingModule,
        SharedModule
    ]
})
export class RolamModule { }
