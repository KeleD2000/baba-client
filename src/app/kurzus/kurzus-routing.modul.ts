import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KurzusComponent } from './kurzus/kurzus.component';



const routes: Routes = [
    {path:"", component: KurzusComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KurzusRoutingModule { 

}
