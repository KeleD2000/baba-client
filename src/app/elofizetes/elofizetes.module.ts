import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElofizetesComponent } from './elofizetes/elofizetes.component';
import { ElofizetesRoutingModule } from './elofizetes-routing.module';
import { FizetesComponent } from './fizetes/fizetes.component';
import { FormsModule } from '@angular/forms';
import { OsszegzesComponent } from './osszegzes/osszegzes.component';
import { SikeresKurzusComponent } from './sikeres-kurzus/sikeres-kurzus.component';
import { SikertelenKurzusComponent } from './sikertelen-kurzus/sikertelen-kurzus.component';




@NgModule({
  declarations: [
    ElofizetesComponent,
    FizetesComponent,
    OsszegzesComponent,
    SikeresKurzusComponent,
    SikertelenKurzusComponent
  ],
  imports: [
    CommonModule,
    ElofizetesRoutingModule,
    FormsModule
  ]
})
export class ElofizetesModule { }
