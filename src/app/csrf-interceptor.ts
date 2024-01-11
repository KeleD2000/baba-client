import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable, forkJoin, from } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { FooldalService } from './services/fooldal.service';


@Injectable()
export class CsrfInterceptorService implements HttpInterceptor {
  private baseUrl = 'https://baba.datastep.solutions:8443';
    constructor(private fooldalService: FooldalService, private authService: AuthService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        // Ellenőrizd, hogy a kérés a megfelelő szolgáltatás URL-ét tartalmazza-e
        if (request.url.includes(this.baseUrl + '/jsonapi/user/user/') || request.url.includes(this.baseUrl + '/jsonapi/hallsession_appointment/default') || request.url.includes(this.baseUrl + '/user/register?_format=json' || this.baseUrl + '/jsonapi/node/videostore') || request.url.includes(this.baseUrl +'/api/flag-entity') || request.url.includes(this.baseUrl +'/api/favorite-videos') || request.url.includes(this.baseUrl + '/api/courseoutline') || request.url.includes(this.baseUrl + '/jsonapi/path_alias/path_alias') || request.url.includes(this.baseUrl + '/api/courses') || request.url.includes(this.baseUrl +'/api/favorite-videos') || request.url.includes(this.baseUrl +'/api/flag-entity') || request.url.includes(this.baseUrl + '/jsonapi/licenses/role') || request.url.includes(this.baseUrl + '/jsonapi/profile/customer') || request.url.includes(this.baseUrl + '/jsonapi/orders/default') || request.url.includes(this.baseUrl + '/jsonapi/checkout') || request.url.includes(this.baseUrl + '/jsonapi/promotion-coupons') || request.url.includes(this.baseUrl + '/jsonapi/course_object_fulfillment/course_object_fulfillment') || request.url.includes(this.baseUrl + '/jsonapi/products/videostore') || request.url.includes(this.baseUrl + '/api/courses?enrolled=1') || request.url.includes(this.baseUrl + '/api/courses?enrolled=0')) {
          // Lekérdezzük a CSRF tokent
          return from(this.fooldalService.getToken()).pipe(
            switchMap((token) => {
              const uid = this.authService.getAuthenticatedUserID();
              if (uid !== undefined) {
                return from(this.authService.getUserId(uid)).pipe(
                  switchMap((apiKey: any) => {
                    const storedApiKey = localStorage.getItem('api-key') || 'default_api_key';
                    const converted = storedApiKey.replace(/"/g, '');
                    console.log(converted);
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
                    const storedApiKey = localStorage.getItem('api-key') || 'default_api_key';
                    const converted = storedApiKey.replace(/"/g, '');
                    const headers = {
                      'X-CSRF-Token': token,
                      'api-key': converted
                    };
                    const modifiedRequest = request.clone({
                      setHeaders: headers,
                    });
                    return next.handle(modifiedRequest);
                  })
                );
              } else {
                // Ha nincs UID, csak a token-t adjuk hozzá a kéréshez
                const storedApiKey = localStorage.getItem('api-key') || 'default_api_key';
                const converted = storedApiKey.replace(/"/g, '');
                const headers = {
                  'X-CSRF-Token': token,
                  'api-key': converted
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