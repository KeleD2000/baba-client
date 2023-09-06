import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CsrfInterceptorService {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // Itt végzed el az interceptor műveleteidet, például hozzáadhatsz CSRF tokent
    // csak a kívánt szolgáltatás kéréseihez

    // Ellenőrizd, hogy a kérés a megfelelő szolgáltatás-e, amelyhez hozzá szeretnéd adni a CSRF tokent
    if (request.url.includes('https://baba.jrdatashu.win/jsonapi/node/videostore')) {      // Adj hozzá a CSRF tokent a kéréshez
      const modifiedRequest = request.clone({
        setHeaders: {
          'X-CSRF-Token': 'A-CSRF-Token-ertek', // Itt helyezd el a tényleges CSRF tokent
        },
      });

      // Továbbítsd a módosított kérést
      return next.handle(modifiedRequest);
    }

    // Ha nem a megfelelő szolgáltatás kérését kapod, akkor ne módosíts semmit
    return next.handle(request);
  }
}
