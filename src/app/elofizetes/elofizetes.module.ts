import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElofizetesComponent } from './elofizetes/elofizetes.component';
import { ElofizetesRoutingModule } from './elofizetes-routing.module';
import { FizetesComponent } from './fizetes/fizetes.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ElofizetesComponent,
    FizetesComponent
  ],
  imports: [
    CommonModule,
    ElofizetesRoutingModule,
    FormsModule
  ]
})
export class ElofizetesModule { }
