import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FooldalService {
  private baseUrl= "https://baba.jrdatashu.win";


  getBaseUrl(){
    return this.baseUrl;
  }

  constructor(private http: HttpClient,
    private authService: AuthService) { 

  }

  getMenu(){
   return this.http.get(`${this.baseUrl}/system/menu/main/linkset`);
  }

  getId(){
    return this.http.get(`${this.baseUrl}/jsonapi/node/page`);
    
  }

  /*getFooldal(id: string){
    return this.http.get(`${this.baseUrl}/jsonapi/node/page/` + id + `?include=field_paragraphs.field_image_full.field_media_image`);
  }*/

  getFooldal(id: string){

    // Define your headers
    const headers = new HttpHeaders({
      //'X-CSRF-Token': '6IjndErFylRc84oYGRh5XkvKinrjCaPCFFp1lD7pMGc',
      'api-key': '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });

    // Include the headers in the options object
    const httpOptions = {
      headers: headers,
    };

    return this.http.get(`${this.baseUrl}/jsonapi/node/page/` + id, httpOptions);
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

  getToken() : Observable<string> {
   return this.http.get<string>(`${this.baseUrl}/session/token`, {responseType: 'text' as 'json'});
  }
  
  getVideos() {
    const auth = btoa('admin:c');
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: 'Basic ' + auth
    });
    return this.http.get(`${this.baseUrl}/jsonapi/node/videostore`, {headers});
  }

  deleteVideos(id: string){
    const auth = btoa('admin:c');
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: 'Basic ' + auth
    });
    return this.http.delete(`${this.baseUrl}/jsonapi/node/videostore/` + id, {headers});
  }

  createMediaVideo(data: any) {
    const auth = btoa('admin:c');
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: 'Basic ' + auth
    });
    return this.http.post(`${this.baseUrl}/jsonapi/media/video`, data, { headers });
  }

  createMediaImage(data: any){
    const auth = btoa('admin:c');
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: 'Basic ' + auth
    });
    return this.http.post(`${this.baseUrl}/jsonapi/media/image`, data, { headers });
  }

  sendVideo(data: FormData, filename: string, id: string) {
    const auth = btoa('admin:c');
    const encodedFilename = encodeURIComponent(filename);
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'Accept' : 'application/vnd.api+json',
      'Content-Disposition' : 'file; filename="'+ encodedFilename +'"',
      Authorization: 'Basic ' + auth
    });

    return this.http.post(`${this.baseUrl}/jsonapi/media/video/` + id + '/field_media_video_file' , data.get('file'), { headers });
  }

  sendImage(data: FormData, filename: string, id: string){
    const auth = btoa('admin:c');
    const encodedFilename = encodeURIComponent(filename);
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'Accept' : 'application/vnd.api+json',
      'Content-Disposition' : 'file; filename="'+ encodedFilename +'"',
      Authorization: 'Basic ' + auth
    });

    return this.http.post(`${this.baseUrl}/jsonapi/media/image/` + id + '/field_media_image' , data.get('file'), { headers });
  }

  patchVideo(data: any, video_id: string){
    const auth = btoa('admin:c');
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
      Authorization: 'Basic ' + auth
    });
    return this.http.patch(`${this.baseUrl}/jsonapi/media/video/` + video_id, data, { headers });
  }

  createThumbnail(data: any){
    const auth = btoa('admin:c');
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: 'Basic ' + auth
    });
    return this.http.post(`${this.baseUrl}/jsonapi/media/image`, data, { headers });
  }

  createVideoParagraph(data: any){
    const auth = btoa('admin:c');
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: 'Basic ' + auth
    });
    return this.http.post(`${this.baseUrl}/jsonapi/paragraph/video`, data, { headers });
  }

  sendVideoStore(data: any){
    const auth = btoa('admin:c');
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: 'Basic ' + auth
    });
    return this.http.post(`${this.baseUrl}/jsonapi/node/videostore`, data, { headers });
  }

  /*getApiKey(){
    const header = new HttpHeaders({
      'X-CSRF-Token' : 'amE7ouD21eJ4JZ2gEyrtzOzMuTxmAO8uxY1kZ2BL6Jk'
    });
    return this.http.get(`${this.baseUrl}/api/key-auth`);
  }
  */

  getCourses(){
    return this.http.get(`${this.baseUrl}/api/courses`);
  }

  getCoursesId() {
    return this.http.get(`${this.baseUrl}/api/courses`).pipe(
      map((response: any) => {
        if (response.courses) {
          const courses = response.courses;
          const cids: string[] = [];
  
          for (const courseId in courses) {
            if (courses.hasOwnProperty(courseId)) {
              const cid = courses[courseId].cid[0].value;
              cids.push(cid);
            }
          }
          
          return cids;
        } else {
          throw new Error('Hibás API válasz struktúra');
        }
      })
    );
  }

  enrolledUser(){
    return this.http.get(`${this.baseUrl}/api/courses?enrolled=1`);
  }

  nonEnrolledUser(){
    return this.http.get(`${this.baseUrl}/api/courses?enrolled=0`);
  }

  enrolledUserOutline(cid: string){
    return this.http.get(`${this.baseUrl}/api/courseoutline/${cid}`);
  }

  getPage(){
    return this.http.get(`${this.baseUrl}/jsonapi/node/page`);
  }

  getPageAlias(){
    return this.http.get(`${this.baseUrl}/jsonapi/path_alias/path_alias`);
  }

  getPageFilter(id: number){
    return this.http.get(`${this.baseUrl}/jsonapi/node/page?filter[drupal_internal__nid]=${id}`);
  }

  catPhotos(id: string){
    const headers = new HttpHeaders({
      'api-key': '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });
    return this.http.get(`${this.baseUrl}/jsonapi/media/image/` + id + `/field_media_image`, {headers});
  }

  getCurrentVideos(id: number){
    const headers = new HttpHeaders({
      'api-key': '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });
    return this.http.get(`${this.baseUrl}/api/videostore/current-videos/` + id, {headers});
  }

  getFavoritesVideos(){
    return this.http.get(`${this.baseUrl}/api/favorite-videos`);
  }

  likedVideos(data: any){
    const headers =  new HttpHeaders({
      "Content-type" : 'application/json'
    });
    return this.http.post(`${this.baseUrl}/api/flag-entity`, data, {headers});
  }

  enrolledCourseLicens(){
    return this.http.get(`${this.baseUrl}/jsonapi/licenses/role`);
  }

  getAllUsers(){
    const headers = new HttpHeaders({
      'api-key' : '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    })
    return this.http.get(`${this.baseUrl}/jsonapi/user/user`, {headers});
  }

  getAllProducts(){
    return this.http.get(`${this.baseUrl}/jsonapi/products/default`);
  }

}
