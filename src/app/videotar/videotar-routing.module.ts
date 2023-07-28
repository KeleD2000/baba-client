import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VidikComponent } from './vidik/vidik.component';



const routes: Routes = [
    {path:"", component: VidikComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideotarRoutingModule { 

}
