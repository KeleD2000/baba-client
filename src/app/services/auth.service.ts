import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../models/Login';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl= "http://baba.jrdatashu.win";
  
 constructor(private http: HttpClient, private router: Router) { 
  
  }

  login(user: Login){
    return this.http.post<User>(`${this.baseUrl}/user/login?_format=json`, user);
  }

  isAuthenticated(){
    const login = localStorage.getItem('login');
    return login;
  }

  logout(logouttoken: string, csrftoken: string){
    localStorage.removeItem('login');
    const requestBody = {};
    console.log(csrftoken);
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrftoken
      });
     return this.http.post(`${this.baseUrl}/user/logout?_format=json`, requestBody, {headers, params:{token: logouttoken}});
  }

   fetchCsrfToken() : Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/session/token`, {responseType: 'text' as 'json'});
  }

  resetPassword(email: string){
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
