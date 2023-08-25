import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElofizetesComponent } from './elofizetes/elofizetes.component';


const routes: Routes = [
    {path:"", component: ElofizetesComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElofizetesRoutingModule { 

}
