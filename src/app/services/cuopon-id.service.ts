import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuoponIdService {
  private sharedCuopon: string = "";
  private cuoponReadySubject = new Subject<string>();

  setCuopon(value: string) {
    this.sharedCuopon = value;
    this.cuoponReadySubject.next(value); // Értesítjük a megvárakozó komponenst
  }

  getCuopon(): Observable<string> {
    return this.cuoponReadySubject.asObservable();
  }
}

