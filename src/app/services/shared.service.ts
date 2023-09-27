import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  cid: string = ''; 

  setCID(cid: string) {
    this.cid = cid;
  }

  getCID() {
    return this.cid;
  }
}
