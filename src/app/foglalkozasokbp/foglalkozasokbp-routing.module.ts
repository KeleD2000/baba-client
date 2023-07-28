import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FbpComponent } from './fbp/fbp.component';


const routes: Routes = [
    {path:"", component: FbpComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoglalkozasokbpRoutingModule { 

}
