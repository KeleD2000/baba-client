import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LombikraComponent } from './lombikra/lombikra.component';


const routes: Routes = [
    {path:"", component: LombikraComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LombikrafelkeszitokurzusRoutingModule { 

}
