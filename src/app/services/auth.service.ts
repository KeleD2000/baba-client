import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../models/Login';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Register } from '../models/Register';
import { Address } from '../models/Address';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "https://baba.jrdatashu.win";

  constructor(private http: HttpClient, private router: Router) {

  }

  login(formData: FormData) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<User>(`${this.baseUrl}/user/login?_format=json`, formData, {headers});
  }

  register(userData: Register) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(`${this.baseUrl}/user/register?_format=json`, userData, httpOptions);
  }

  registerAddress(userAddress: Address) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${this.baseUrl}/user/register?_format=json`, userAddress, httpOptions);
  }

  isAuthenticated() {
    const login = localStorage.getItem('login');
    return login;
  }

  getAuthenticatedUserID(){
    const login = localStorage.getItem('login');
    if(login){
      var json = JSON.parse(login);
      return json.current_user.uid;
    }
    return undefined;
  }

  getUserId(uid: string){
    const auth = btoa('admin:c');
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: 'Basic ' + auth
    });
    return this.http.get(`${this.baseUrl}/jsonapi/user/user?filter[uid][value]=${uid}`, {headers});
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

  resetPassword(email: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const data = {
      mail: email
    };
    return this.http.post(`${this.baseUrl}/user/password?_format=json`, JSON.stringify(data), httpOptions);
  }

}
