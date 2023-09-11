import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-refresh',
  templateUrl: './refresh.component.html',
  styleUrls: ['./refresh.component.css']
})
export class RefreshComponent {

  constructor(private router: Router){

  }

  ngAfterViewInit() {
    // Irányítás a "not-found" oldalra
    this.router.navigate(['/not-found']);

    // Az oldal frissítése egy kis idő múlva (pl. 100 milliszekundum)
    setTimeout(() => {
      window.location.reload();
    }, 50);
  }

}
