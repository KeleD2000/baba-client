import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideotarComponent } from './videotar/videotar.component';
import { AuthGuard } from '../authguards/admin.guard';


const routes: Routes = [
    {path: 'avidi', component: VideotarComponent, /*canActivate: [AuthGuard]*/}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { 

}
