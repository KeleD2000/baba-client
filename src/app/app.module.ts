import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooldalModule } from './fooldal/fooldal.module';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HtmlconvertService } from './services/htmlconvert.service';



@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FooldalModule, 
    HttpClientModule,
    RouterModule,
    FontAwesomeModule
    
  ],
  providers: [HtmlconvertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
