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
        if (request.url.includes('https://baba.datastep.solutions/jsonapi/node/videostore') || request.url.includes('https://baba.datastep.solutions/api/courseoutline') || request.url.includes('https://baba.datastep.solutions/jsonapi/path_alias/path_alias') || request.url.includes('https://baba.datastep.solutions/api/courses') || request.url.includes('https://baba.datastep.solutions/api/favorite-videos') || request.url.includes('https://baba.datastep.solutions/api/flag-entity') || request.url.includes('https://baba.datastep.solutions/jsonapi/licenses/role') || request.url.includes('https://baba.datastep.solutions/jsonapi/profile/customer') || request.url.includes('https://baba.datastep.solutions/jsonapi/orders/default') || request.url.includes('https://baba.datastep.solutions/jsonapi/checkout') || request.url.includes('https://baba.datastep.solutions/jsonapi/promotion-coupons') || request.url.includes('https://baba.datastep.solutions/jsonapi/course_object_fulfillment/course_object_fulfillment') || request.url.includes('https://baba.datastep.solutions/jsonapi/products/videostore')) {
          // Lekérdezzük a CSRF tokent
          return from(this.fooldalService.getToken()).pipe(
            switchMap((token) => {
              const uid = this.authService.getAuthenticatedUserID();
              if (uid !== undefined) {
                return from(this.authService.getUserId(uid)).pipe(
                  switchMap((apiKey: any) => {
                    const storedApiKey = localStorage.getItem('user_api_key') || 'default_api_key';
                    const converted = storedApiKey.replace(/"/g, '');
                    const headers = {
                      'X-CSRF-Token': token,
                      'api-key': converted
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
                      'api-key': "48362b0788e1a3d62257e4ca36603006"
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
                  'api-key': "48362b0788e1a3d62257e4ca36603006"
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