import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailchimpService {
  private apiKey = "926e51bb92aadf8494e3e449fe387e85-us21";

  constructor(private http: HttpClient) { }

  addEmailToMailChimp(body: any){
    const url = "https://us21.api.mailchimp.com/3.0/lists/0ee100e198/members"
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'Acces-Control-Allow-Origin' : '*'
    });
  
    return this.http.post(url, body, { headers: headers });
  }

}
