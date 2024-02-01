import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'
import { FooldalRoutingModule } from './fooldal-routing.module';
import { TartalomComponent } from './tartalom/tartalom.component';
import { SharedModule } from "../shared/shared.module";
import { TartalomsafePipe } from '../pipes/tartalomsafe.pipe';



@NgModule({
    declarations: [
        TartalomComponent,
        TartalomsafePipe
    ],
    imports: [
        CommonModule,
        RouterModule,
        FooldalRoutingModule,
        SharedModule
    ]
})
export class FooldalModule { }
