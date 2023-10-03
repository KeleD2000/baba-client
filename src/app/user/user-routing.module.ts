import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViditekaComponent } from './viditeka/viditeka.component';





const routes: Routes = [
    {path: 'viditeka' , component: ViditekaComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { 

}
