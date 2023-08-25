import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElofizetesComponent } from './elofizetes/elofizetes.component';
import { ElofizetesRoutingModule } from './elofizetes-routing.module';



@NgModule({
  declarations: [
    ElofizetesComponent
  ],
  imports: [
    CommonModule,
    ElofizetesRoutingModule
  ]
})
export class ElofizetesModule { }
