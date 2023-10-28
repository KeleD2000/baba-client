import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElofizetesComponent } from './elofizetes/elofizetes.component';
import { FizetesComponent } from './fizetes/fizetes.component';


const routes: Routes = [
    {path:"elofizetes", component: ElofizetesComponent},
    {path: "fizetes", component: FizetesComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElofizetesRoutingModule { 

}
