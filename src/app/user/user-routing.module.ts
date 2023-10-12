import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViditekaComponent } from './viditeka/viditeka.component';
import { KedvencVideokComponent } from './kedvenc-videok/kedvenc-videok.component';





const routes: Routes = [
    {path: 'napi-ajanlat' , component: ViditekaComponent},
    {path: 'kedvenc-videok', component: KedvencVideokComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { 

}
