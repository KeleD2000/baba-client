import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedInUserSubject = new BehaviorSubject<any>(null);
  loggedInUser$: Observable<any> = this.loggedInUserSubject.asObservable();

  constructor() { }

  setLoggedInUser(user: any) {
    this.loggedInUserSubject.next(user);
  }

  getLoggedInUser(): any {
    return this.loggedInUserSubject.getValue();
  }
}
