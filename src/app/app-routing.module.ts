import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FooldalModule } from './fooldal/fooldal.module';
import { BabafeszkelokurzusModule } from './babafeszkelokurzus/babafeszkelokurzus.module';
import { LombikrafelkeszitokurzusModule } from './lombikrafelkeszitokurzus/lombikrafelkeszitokurzus.module';
import { FoglalkozasokbpModule } from './foglalkozasokbp/foglalkozasokbp.module';
import { RolamModule } from './rolam/rolam.module';
import { VideotarModule } from './videotar/videotar.module';

const routes: Routes = [
  {path: '', loadChildren: () => FooldalModule},
  {path: 'fooldal', loadChildren: () => FooldalModule},
  {path: 'babafeszkelo-kurzus', loadChildren: () => BabafeszkelokurzusModule},
  {path: 'lombikra-felkeszito-kurzus', loadChildren: () => LombikrafelkeszitokurzusModule},
  {path: 'foglalkozasok-budapesten', loadChildren: () => FoglalkozasokbpModule},
  {path: 'rolam', loadChildren: () => RolamModule},
  {path: 'videotar', loadChildren:() => VideotarModule},
  {path: '' , loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
