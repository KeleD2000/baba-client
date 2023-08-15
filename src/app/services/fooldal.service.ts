import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FooldalService {
  private baseUrl= "http://baba.jrdatashu.win";

  getBaseUrl(){
    return this.baseUrl;
  }

  constructor(private http: HttpClient) { 

  }

  getMenu(){
   return this.http.get(`${this.baseUrl}/system/menu/main/linkset`);
  }

  getId(){
    return this.http.get(`${this.baseUrl}/jsonapi/node/page`);
    
  }

  getFooldal(id: string){
    return this.http.get(`${this.baseUrl}/jsonapi/node/page/` + id);
  }

  getPhotos(id: string, media: string, image: string){
    return this.http.get(`${this.baseUrl}/jsonapi/` + media + '/' + image + '/' + id);
  }

  getCatNames(){
    return this.http.get(`${this.baseUrl}/jsonapi/taxonomy_term/videostore_categories`);
  }

  getRotation(){
    return this.http.get(`${this.baseUrl}/jsonapi/taxonomy_term/rotation`);
  }

  getVideos(){
    const auth = btoa('admin:c');
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + auth
    });
    return this.http.get(`${this.baseUrl}/jsonapi/node/videostore`,{ headers });
  }

}
