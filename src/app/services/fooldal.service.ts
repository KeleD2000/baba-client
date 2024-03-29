import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FooldalService {
  private baseUrl = "https://baba.datastep.solutions:8443";


  getBaseUrl() {
    return this.baseUrl;
  }

  constructor(private http: HttpClient,
    private authService: AuthService) {

  }

  getMenu() {
    return this.http.get(`${this.baseUrl}/system/menu/main/linkset`);
  }

  getId() {
    return this.http.get(`${this.baseUrl}/jsonapi/node/page`);

  }

  /*getFooldal(id: string){
    return this.http.get(`${this.baseUrl}/jsonapi/node/page/` + id + `?include=field_paragraphs.field_image_full.field_media_image`);
  }*/

  getFooldal(id: string) {

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

  getPhotos(id: string, media: string, image: string) {
    return this.http.get(`${this.baseUrl}/jsonapi/` + media + '/' + image + '/' + id);
  }

  getCatNames() {
    return this.http.get(`${this.baseUrl}/jsonapi/taxonomy_term/videostore_categories`);
  }

  getRotation() {
    return this.http.get(`${this.baseUrl}/jsonapi/taxonomy_term/rotation`);
  }

  getToken(): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/session/token`, { responseType: 'text' as 'json' });
  }
  
  getVideos(url?: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      'api-key': '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });
  
    // Ha van megadva URL, akkor azt használjuk, különben az alap URL-t
    const apiUrl = url || `${this.baseUrl}/jsonapi/node/videostore?sort=field_weight,id`;
  
    return this.http.get(apiUrl, { headers });
  }
  

  deleteVideos(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      'api-key' : '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });
    return this.http.delete(`${this.baseUrl}/jsonapi/node/videostore/` + id, { headers });
  }

  createMediaVideo(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      'api-key' : '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });
    return this.http.post(`${this.baseUrl}/jsonapi/media/video`, data, { headers });
  }

  createMediaImage(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      'api-key' : '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });
    return this.http.post(`${this.baseUrl}/jsonapi/media/image`, data, { headers });
  }

  sendVideo(data: FormData, filename: string, id: string) {
    const encodedFilename = encodeURIComponent(filename);
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'Accept': 'application/vnd.api+json',
      'Content-Disposition': 'file; filename="' + encodedFilename + '"',
      'api-key' : '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });

    return this.http.post(`${this.baseUrl}/jsonapi/media/video/` + id + '/field_media_video_file', data.get('file'), { headers });
  }

  sendImage(data: FormData, filename: string, id: string) {
    const encodedFilename = encodeURIComponent(filename);
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'Accept': 'application/vnd.api+json',
      'Content-Disposition': 'file; filename="' + encodedFilename + '"',
      'api-key' : '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });

    return this.http.post(`${this.baseUrl}/jsonapi/media/image/` + id + '/field_media_image', data.get('file'), { headers });
  }

  patchVideo(data: any, video_id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
      'api-key' : '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });
    return this.http.patch(`${this.baseUrl}/jsonapi/media/video/` + video_id, data, { headers });
  }

  createThumbnail(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      'api-key' : '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });
    return this.http.post(`${this.baseUrl}/jsonapi/media/image`, data, { headers });
  }

  createVideoParagraph(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      'api-key' : '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });
    return this.http.post(`${this.baseUrl}/jsonapi/paragraph/video`, data, { headers });
  }

  sendVideoStore(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      'api-key' : '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
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

  getCourses() {
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

  enrolledUser() {
    return this.http.get(`${this.baseUrl}/api/courses?enrolled=1`);
  }

  nonEnrolledUser() {
    return this.http.get(`${this.baseUrl}/api/courses?enrolled=0`);
  }

  enrolledUserOutline(cid: string) {
    return this.http.get(`${this.baseUrl}/api/courseoutline/${cid}`);
  }

  getPage() {
    return this.http.get(`${this.baseUrl}/jsonapi/node/page`);
  }

  getPageAlias() {
    return this.http.get(`${this.baseUrl}/jsonapi/path_alias/path_alias`);
  }

  getPageFilter(id: number) {
    return this.http.get(`${this.baseUrl}/jsonapi/node/page?filter[drupal_internal__nid]=${id}`);
  }

  catPhotos(id: string) {
    const headers = new HttpHeaders({
      'api-key': '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });
    return this.http.get(`${this.baseUrl}/jsonapi/media/image/` + id + `/field_media_image`, { headers });
  }

  getCurrentVideos(id: number) {
    const headers = new HttpHeaders({
      'api-key': '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });
    return this.http.get(`${this.baseUrl}/api/videostore/current-videos/` + id, { headers });
  }

  getFavoritesVideos() {
    return this.http.get(`${this.baseUrl}/api/favorite-videostore`);
  }

  likedVideos(data: any) {
    const headers = new HttpHeaders({
      "Content-type": 'application/json'
    });
    return this.http.post(`${this.baseUrl}/api/flag-entity`, data, { headers });
  }

  enrolledCourseLicens() {
    return this.http.get(`${this.baseUrl}/jsonapi/licenses/role`);
  }

  getAllUsers() {
    const headers = new HttpHeaders({
      'api-key': '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    })
    return this.http.get(`${this.baseUrl}/jsonapi/user/user`, { headers });
  }

  getAllProducts() {
    return this.http.get(`${this.baseUrl}/jsonapi/products/default`);
  }

  getAllVideoStoreProducts(){
    return this.http.get(`${this.baseUrl}/jsonapi/products/videostore`);
  }

  addItemToCart(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json'
    });
    return this.http.post(`${this.baseUrl}/jsonapi/cart/add`, data, { headers });
  }

  getProfileCustomer() {
    return this.http.get(`${this.baseUrl}/jsonapi/profile/customer`);
  }

  addProductWithCart(data: any, id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json'
    });
    return this.http.patch(`${this.baseUrl}/jsonapi/checkout/` + id , data, { headers });
  }

  addCuopon(data: any, id: any) {
    const headers = new HttpHeaders ({
      'Content-Type': 'application/vnd.api+json',
      'api-key': '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });
    return this.http.post(`${this.baseUrl}/jsonapi/orders/default/` + id +`/relationships/coupons`, data, {headers})

  }

  getAllCuopons(){
    return this.http.get(`${this.baseUrl}/jsonapi/promotion-coupons`);
  }

  getProductById(id: any){
    return this.http.get(`${this.baseUrl}/jsonapi/orders/default/` + id);
  }

  getPayPalAccesToken(data: any){
    const auth = btoa('AToSxjcGJXgQ85oxUXqEmUgIkEW6tdE4Dx2X037MCuF_BN1vTohGlIbglVgpvaOwbqoaJLz7peUkfKC7:EGhfOoFn1bkAKB5kvWQTVbmptTIkJSqdHtfw-z3SSReiXyhNCFHBBgf_HWUa2k2scGyHt2mEWnxknvJg');
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + auth,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(`https://api-m.sandbox.paypal.com/v1/oauth2/token`, data, {headers});

  }

  createPayPalOrder(data: any, accesToken: string){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + accesToken,
      'Content-Type': 'application/json',
    });
    return this.http.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders`, data, {headers});
  }
  
  addPaymentMethod(data: any, id: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      'api-key': '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });

    return this.http.patch(`${this.baseUrl}/jsonapi/checkout/` + id, data, {headers});
  }

  startPayment(data: any, id: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      'api-key': '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    });

    return this.http.post(`${this.baseUrl}/jsonapi/checkout/` + id + `/payment`, data, {headers});
  }

  patchVideoWatched(data: any, id: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json'
    });

    return this.http.patch(`${this.baseUrl}/jsonapi/course_object_fulfillment/course_object_fulfillment/` + id, data, {headers});
  }

  getFaqCat(){
    return this.http.get(`${this.baseUrl}/jsonapi/taxonomy_term/faq_categories?sort=weight`);
  }
  
  getScreeningQuestions(id: any){
    return this.http.get(`${this.baseUrl}/jsonapi/node/faq?sort=field_weight&filter[field_faq_category.id]=` + id);
  }

  getHallSessionProduct(){
    const headers = new HttpHeaders({
      'api-key' : '4d6b1b9d7ce8eddd9e81a4a0150c3d34'
    })
    return this.http.get(`${this.baseUrl}/jsonapi/products/hallsession`, {headers});
  }

  postHallBook(data: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json'
    })
    return this.http.post(`${this.baseUrl}/jsonapi/hallsession_appointment/default`, data, {headers});
  }

  getPromotions(){
    return this.http.get(`${this.baseUrl}/jsonapi/promotions`)
  }


  getCountryCode(){
    return this.http.get(`${this.baseUrl}/api/countrylist`);
  }
}
