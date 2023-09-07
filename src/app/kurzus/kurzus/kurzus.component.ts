import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-kurzus',
  templateUrl: './kurzus.component.html',
  styleUrls: ['./kurzus.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('collapsed <=> expanded', animate('200ms ease-out')),
    ]),
  ]
})
export class KurzusComponent {

  showLessons: boolean = false;

  constructor(){}

  ngOnInit(): void {}

  toggleLessons(){
    this.showLessons = !this.showLessons;
  }
}
