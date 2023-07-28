import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TartalomComponent } from './tartalom/tartalom.component';

const routes: Routes = [
    {path:"", component: TartalomComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FooldalRoutingModule { }
