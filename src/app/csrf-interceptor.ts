import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable, forkJoin, from } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { FooldalService } from './services/fooldal.service';


@Injectable()
export class CsrfInterceptorService implements HttpInterceptor {
    constructor(private fooldalService: FooldalService, private authService: AuthService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        // Ellenőrizd, hogy a kérés a megfelelő szolgáltatás URL-ét tartalmazza-e
        if (request.url.includes('https://baba.jrdatashu.win/jsonapi/node/videostore') || request.url.includes('https://baba.jrdatashu.win/api/courseoutline') || request.url.includes('https://baba.jrdatashu.win/api/courses?enrolled=0') || request.url.includes('https://baba.jrdatashu.win/api/courses?enrolled=1') || request.url.includes('https://baba.jrdatashu.win/jsonapi/path_alias/path_alias') || request.url.includes('https://baba.jrdatashu.win/api/courses') || request.url.includes('https://baba.jrdatashu.win/api/favorite-videos') || request.url.includes('https://baba.jrdatashu.win/api/flag-entity') || request.url.includes('https://baba.jrdatashu.win/jsonapi/licenses/role') || request.url.includes('https://baba.jrdatashu.win/jsonapi/profile/customer') || request.url.includes('https://baba.jrdatashu.win/jsonapi/orders/default') || request.url.includes('https://baba.jrdatashu.win/jsonapi/checkout') || request.url.includes('https://baba.jrdatashu.win/jsonapi/promotion-coupons')){
          // Lekérdezzük a CSRF tokent
          return from(this.fooldalService.getToken()).pipe(
            switchMap((token) => {
              const uid = this.authService.getAuthenticatedUserID();
              if (uid !== undefined) {
                return from(this.authService.getUserId(uid)).pipe(
                  switchMap((apiKey: any) => {
                 
                    const headers = {
                      'X-CSRF-Token': token,
                      'api-key': '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
                    };
                    const modifiedRequest = request.clone({
                      setHeaders: headers,
                    });
                    return next.handle(modifiedRequest);
                  }),
                  catchError((err) => {
                    console.log(err);
                    // Ha valami hiba történik a userId lekérdezésekor
                    // akkor csak a token-t adjuk hozzá a kéréshez
                    const headers = {
                      'X-CSRF-Token': token,
                      'api-key': '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
                    };
                    const modifiedRequest = request.clone({
                      setHeaders: headers,
                    });
                    return next.handle(modifiedRequest);
                  })
                );
              } else {
                // Ha nincs UID, csak a token-t adjuk hozzá a kéréshez
                const headers = {
                  'X-CSRF-Token': token,
                  'api-key': '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
                };
                const modifiedRequest = request.clone({
                  setHeaders: headers,
                });
                return next.handle(modifiedRequest);
              }
            })
          );
        }
        // Ha nem a megfelelő szolgáltatás kérését kapjuk, akkor nem módosítunk semmit
        return next.handle(request);
      }
}