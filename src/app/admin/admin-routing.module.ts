import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideotarComponent } from './videotar/videotar.component';


const routes: Routes = [
    {path: 'videotar', component: VideotarComponent}
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { 

}
