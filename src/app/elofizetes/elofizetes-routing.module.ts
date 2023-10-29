import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElofizetesComponent } from './elofizetes/elofizetes.component';
import { FizetesComponent } from './fizetes/fizetes.component';
import { OsszegzesComponent } from './osszegzes/osszegzes.component';
import { SikeresKurzusComponent } from './sikeres-kurzus/sikeres-kurzus.component';
import { SikertelenKurzusComponent } from './sikertelen-kurzus/sikertelen-kurzus.component';


const routes: Routes = [
    {path:"elofizetes", component: ElofizetesComponent},
    {path: "fizetes", component: FizetesComponent},
    {path:'osszegzes', component: OsszegzesComponent},
    {path:'sikeres_fizetes', component: SikeresKurzusComponent},
    {path: 'sikertelen_fizetes', component: SikertelenKurzusComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElofizetesRoutingModule { 

}
