import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../models/Login';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { Register } from '../models/Register';
import { Address } from '../models/Address';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "https://baba.datastep.solutions:8443";

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {

  }

  login(user: Login) {
    return this.http.post<User>(`${this.baseUrl}/user/login?_format=json`, user);
  }

  register(userData: Register) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })

    return this.http.post(`${this.baseUrl}/user/register?_format=json`, userData, { headers });
  }

  registerAddress(userAddress: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/vnd.api+json'
      })
    };
    return this.http.post(`${this.baseUrl}/jsonapi/profile/customer`, userAddress, httpOptions);
  }

  isAuthenticated() {
    const login = localStorage.getItem('login');
    return login;
  }

  getAuthenticatedUserID() {
    const login = localStorage.getItem('login');
    if (login) {
      var json = JSON.parse(login);
      return json.current_user.uid;
    }
    return undefined;
  }

  getUserId(uid: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      'api-key' : '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });
    return this.http.get(`${this.baseUrl}/jsonapi/user/user?filter[uid][value]=${uid}`, { headers });
  }

  isAdmin(): boolean {
    const authenticated = this.isAuthenticated();
    if (authenticated) {
      const json = JSON.parse(authenticated);
      if (json.current_user.roles) {
        if (json.current_user.roles.includes("administrator")) {
          return true;
        }
      }
    }
    return false;
  }

  logout(logouttoken: string, csrftoken: string) {
    localStorage.removeItem('login');
    const requestBody = {};
    console.log(csrftoken);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', //x-www-form-urlencoded
      'X-CSRF-Token': csrftoken,
      //'api-key': '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });
    // Include the headers in the options object
    const httpOptions = {
      headers: headers,
      //params: {_format: 'json', token: csrftoken, csrf_token: csrftoken}
    };
    return this.http.get(`${this.baseUrl}/api/logout`, httpOptions);
  }

  fetchCsrfToken(): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/session/token`, { responseType: 'text' as 'json' });
  }

  lostPassword(data: any){
    const headers =  new HttpHeaders({
      "Content-Type" : "application/json"
    });
    return this.http.post(`${this.baseUrl}/user/lost-password?_format=json`, data, {headers});
  }

  resetPassword(data: any){
    const headers =  new HttpHeaders({
      "Content-Type" : "application/json"
    });
    return this.http.post(`${this.baseUrl}/user/lost-password-reset?_format=json`, data, {headers});
  }

  updateUser(id: string, body: any){
    const headers = new HttpHeaders({
      "Content-Type" : "application/vnd.api+json"
    });
    return this.http.patch(`${this.baseUrl}/jsonapi/user/user/${id}`,body, {headers});
  }

  updateProfile(id: string, body: any){
    const headers = new HttpHeaders({
      "Content-Type" : "application/vnd.api+json"
    });
    return this.http.patch(`${this.baseUrl}/jsonapi/profile/customer/${id}`, body, {headers});
  }

}
