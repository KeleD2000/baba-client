import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooldalModule } from './fooldal/fooldal.module';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HtmlconvertService } from './services/htmlconvert.service';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { SharedModule } from './shared/shared.module';
import { AngularFireModule } from '@angular/fire/compat';

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
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FooldalModule, 
    HttpClientModule,
    RouterModule,
    FontAwesomeModule,
    AuthModule,
    AdminModule,
    SharedModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [HtmlconvertService],
  bootstrap: [AppComponent]
})
export class AppModule { }

