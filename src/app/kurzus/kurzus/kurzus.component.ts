import { Component } from '@angular/core';

@Component({
  selector: 'app-kurzus',
  templateUrl: './kurzus.component.html',
  styleUrls: ['./kurzus.component.css']
})
export class KurzusComponent {

  showLessons: boolean = false;

  constructor(){}

  toggleLessons(){
    this.showLessons = !this.showLessons;
  }
}
