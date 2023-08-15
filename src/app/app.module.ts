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
    SharedModule
  ],
  providers: [HtmlconvertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
