import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolamComponent } from './rolam/rolam.component';



const routes: Routes = [
    {path:"", component: RolamComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolamRoutingModule { 

}
