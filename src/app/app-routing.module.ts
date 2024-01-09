import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FooldalModule } from './fooldal/fooldal.module';
import { BabafeszkelokurzusModule } from './babafeszkelokurzus/babafeszkelokurzus.module';
import { LombikrafelkeszitokurzusModule } from './lombikrafelkeszitokurzus/lombikrafelkeszitokurzus.module';
import { FoglalkozasokbpModule } from './foglalkozasokbp/foglalkozasokbp.module';
import { RolamModule } from './rolam/rolam.module';
import { VideotarModule } from './videotar/videotar.module';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdatkezelesComponent } from './components/adatkezeles/adatkezeles.component';
import { AszfComponent } from './components/aszf/aszf.component';
import { KurzusModule } from './kurzus/kurzus.module';
import { RefreshComponent } from './components/refresh/refresh.component';
import { KurzusoldalComponent } from './kurzus/kurzusoldal/kurzusoldal.component';
import { GyikComponent } from './components/gyik/gyik.component';
import { LostPasswordComponent } from './components/lost-password/lost-password.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';

const routes: Routes = [
  {path: '', loadChildren: () => FooldalModule},
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'lost-password', component: LostPasswordComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'gdpr', component: AdatkezelesComponent},
  {path: 'aszf', component: AszfComponent},
  {path: 'GYIK', component: GyikComponent},
  {path: 'fooldal', loadChildren: () => FooldalModule},
  {path: 'babafeszkelo-kurzus', loadChildren: () => BabafeszkelokurzusModule},
  {path: 'lombikra-felkeszito-kurzus', loadChildren: () => LombikrafelkeszitokurzusModule},
  {path: 'foglalkozasok-teremben', loadChildren: () => FoglalkozasokbpModule},
  {path: 'user', loadChildren:() => import('./user/user.module').then(u =>u.UserModule), canActivate: [UserGuard]},
  {path: 'admin' , loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [AdminGuard]},
  {path: '', loadChildren: () => import('./elofizetes/elofizetes.module').then(e => e.ElofizetesModule)},
  {path: 'rolam', loadChildren: () => RolamModule},
  {path: 'videotar', loadChildren:() => VideotarModule},
  {path: 'kurzusok/:title', loadChildren: () => KurzusModule},
  {path: 'kurzusaloldal/:urlParam', component: KurzusoldalComponent},
  {path: 'update-profile', component: UpdateProfileComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'refresh', component: RefreshComponent},
  {path: '**', component: RefreshComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
