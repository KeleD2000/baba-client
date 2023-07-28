import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class FooldalService {
  private baseUrl= "http://baba.jrdatashu.win";



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

}
