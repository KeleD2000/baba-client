import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooldalModule } from './fooldal/fooldal.module';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HtmlconvertService } from './services/htmlconvert.service';

import { AdminModule } from './admin/admin.module';
import { SharedModule } from './shared/shared.module';
import { AngularFireModule } from '@angular/fire/compat';

import { FooterComponent } from './components/footer/footer.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdatkezelesComponent } from './components/adatkezeles/adatkezeles.component';
import { AszfComponent } from './components/aszf/aszf.component';

const firebaseConfig = {
  apiKey: "AIzaSyBSwXraHIkw4DG5uRRsfD_FFqAhMWG5X_w",
  authDomain: "babafeszkelo-51994.firebaseapp.com",
  projectId: "babafeszkelo-51994",
  storageBucket: "babafeszkelo-51994.appspot.com",
  messagingSenderId: "850014304360",
  appId: "1:850014304360:web:4a2ce8a76afee5df2d63dd"
};

@NgModule({
  declarations: [
    AppComponent,
    LoadingSpinnerComponent,
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    SigninComponent,
    SignupComponent,
    ResetPasswordComponent,
    AdatkezelesComponent,
    AszfComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FooldalModule, 
    HttpClientModule,
    RouterModule,
    FontAwesomeModule,
    AdminModule,
    SharedModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [HtmlconvertService],
  bootstrap: [AppComponent]
})
export class AppModule { }

