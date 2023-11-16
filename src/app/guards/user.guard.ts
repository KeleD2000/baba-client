
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(): boolean {
    if(localStorage.getItem('login')){
      return true;
    }else{
      this.router.navigate(['/fooldal']);
      return false;
    }
  }

};
