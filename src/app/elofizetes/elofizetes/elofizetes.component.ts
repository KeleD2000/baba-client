import { Component, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription, subscribeOn } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-elofizetes',
  templateUrl: './elofizetes.component.html',
  styleUrls: ['./elofizetes.component.css']
})
export class ElofizetesComponent {
  courseDetails: any[] = []; //feliratkozott
  courseDetailsExpires: any[] = [];
  courseNonEnrollmentDetails: any[] = [];//nem feliratkozott
  courseNonEnrollmentsDetailsExpires: any[] = [];
  vidCourseNonEnrollmentsDetailsExpires: any[] = [];
  promRole: any[] = [];
  course: any[] = [];
  courseCommercie: any[] = [];
  products: any[] = [];
  private loggedInUserSubscription?: Subscription;
  loggedUser: any;
  percentage: number = 0;
  promotionObject: any = {};
  promotionsArray: any[] = [];
  postDataProducts: any = {};
  active: boolean = false;
  productDatas: any = {};
  cuoponDatas: any = {};
  licensProduct: any[] = [];
  productsForLicens: any[] = [];
  productsVidForLicens: any[] = [];

  public cuoponIdProduct: string = "";



  constructor(private fooldalService: FooldalService, private shared: SharedService,
    private htmlconvertService: HtmlconvertService, private authService: AuthService,
    private router: Router) {

  }

  addCart(type: any, id: any) {
    this.postDataProducts = {
      data: [
        {
          type: type,
          id: id,
          meta: {
            quantity: 1,
            combine: true,
          },
        },
      ],
    };
    const objProf = {
      name: '',
    };
    const objBilling = {
      country_code: '',
      locality: '',
      postal_code: '',
      address_line1: '',
      address_line2: '',
      given_name: '',
      family_name: '',
    };
    this.fooldalService.addItemToCart(this.postDataProducts).subscribe((p) => {
      for (const [key, value] of Object.entries(p)) {
        if (key === 'data') {
          for (let i in value) {
            const obj = {
              title: '',
              price: '',
            };
            const regex = /(.+?) - (\d+ hónap)/;
            const founded = value[i].attributes.title.match(regex);

            if (founded) {
              obj.title = founded[1].trim();
            }

            obj.price = value[i].attributes.total_price.formatted;
            localStorage.setItem('product', JSON.stringify(obj));
            console.log(localStorage.getItem('product'));

            this.fooldalService.getAllUsers().subscribe((user) => {
              for (const [kk, vv] of Object.entries(user)) {
                if (kk === 'data') {
                  for (let j in vv) {
                    objProf.name = vv[j].attributes.name;

                    if (localStorage.getItem('login')) {
                      var loginData = JSON.parse(localStorage.getItem('login') || '');

                      if (loginData && loginData.current_user && loginData.current_user.name) {
                        var name = loginData.current_user.name;
                      }
                    }

                    if (name === objProf.name) {
                      var userId = vv[j].id;
                      console.log(userId);
                      this.fooldalService.getProfileCustomer().subscribe((profile) => {
                        for (const [k, v] of Object.entries(profile)) {
                          if (k === 'data') {
                            for (let j in v) {
                              if (userId === v[j].relationships.uid.data.id) {
                                objBilling.country_code = v[j].attributes.address.country_code;
                                objBilling.locality = v[j].attributes.address.locality;
                                objBilling.postal_code = v[j].attributes.address.postal_code;
                                objBilling.address_line1 = v[j].attributes.address.address_line1;
                                objBilling.address_line2 = v[j].attributes.address.address_line2;
                                objBilling.given_name = v[j].attributes.address.given_name;
                                objBilling.family_name = v[j].attributes.address.family_name;
                              }
                            }
                          }
                        }
                        this.productDatas = {
                          "data": {
                            "type": value[i].relationships.order_id.data.type,
                            "id": value[i].relationships.order_id.data.id,
                            "attributes": {
                              "billing_information": {
                                "address": {
                                  "country_code": objBilling.country_code,
                                  "locality": objBilling.locality,
                                  "postal_code": objBilling.postal_code,
                                  "address_line1": objBilling.address_line1,
                                  "address_line2": objBilling.address_line2,
                                  "given_name": objBilling.given_name,
                                  "family_name": objBilling.family_name,
                                },
                                "tax_number": {
                                  "type": null,
                                  "value": null
                                }
                              }
                            },
                            "relationships": {
                              "uid": {
                                "data": {
                                  "type": "user--user",
                                  "id": userId
                                }
                              }
                            }
                          }
                        };
                        var orderId = value[i].relationships.order_id.data.id;
                        this.fooldalService.addProductWithCart(this.productDatas, orderId).subscribe((p) => {
                          for (const [keyP, valueP] of Object.entries(p)) {
                            if (keyP === 'data') {
                              for (let k in valueP) {
                                console.log(valueP.id);
                                localStorage.setItem('productId', valueP.id.toString());
                              }
                            }
                          }
                        });
                      });
                    } else {
                      var userId2 = localStorage.getItem('user_id');
                      if (userId2 !== null) {
                        var userIdIfNotLog = userId2.replace(/"/g, '');
                        console.log(userId);
                      } else {
                        console.log('A "user_id" kulcs nem található a localStorage-ban.');
                      }
                      this.fooldalService.getProfileCustomer().subscribe((profile) => {
                        for (const [k, v] of Object.entries(profile)) {
                          if (k === 'data') {
                            for (let j in v) {
                              if (userIdIfNotLog === v[j].relationships.uid.data.id) {
                                objBilling.country_code = v[j].attributes.address.country_code;
                                objBilling.locality = v[j].attributes.address.locality;
                                objBilling.postal_code = v[j].attributes.address.postal_code;
                                objBilling.address_line1 = v[j].attributes.address.address_line1;
                                objBilling.address_line2 = v[j].attributes.address.address_line2;
                                objBilling.given_name = v[j].attributes.address.given_name;
                                objBilling.family_name = v[j].attributes.address.family_name;
                              }
                            }
                          }
                        }
                        this.productDatas = {
                          "data": {
                            "type": value[i].relationships.order_id.data.type,
                            "id": value[i].relationships.order_id.data.id,
                            "attributes": {
                              "billing_information": {
                                "address": {
                                  "country_code": objBilling.country_code,
                                  "locality": objBilling.locality,
                                  "postal_code": objBilling.postal_code,
                                  "address_line1": objBilling.address_line1,
                                  "address_line2": objBilling.address_line2,
                                  "given_name": objBilling.given_name,
                                  "family_name": objBilling.family_name,
                                },
                                "tax_number": {
                                  "type": null,
                                  "value": null
                                }
                              }
                            },
                            "relationships": {
                              "uid": {
                                "data": {
                                  "type": "user--user",
                                  "id": userIdIfNotLog
                                }
                              }
                            }
                          }
                        };
                        var orderId = value[i].relationships.order_id.data.id;
                        this.fooldalService.addProductWithCart(this.productDatas, orderId).subscribe((p) => {
                          for (const [keyP, valueP] of Object.entries(p)) {
                            if (keyP === 'data') {
                              for (let k in valueP) {
                                console.log(valueP.id);
                                localStorage.setItem('productId', valueP.id.toString());
                              }
                            }
                          }
                        });
                      });
                    }
                  }
                }
              }
            });
          }
        }
      }
      if (localStorage.getItem('login')) {
        this.router.navigate(['/fizetes']);
      } else {
        this.router.navigate(['/signin'], { queryParams: { from: 'elofizetes' } });
      }
    });
  }

  isCourseActive(sku: string): boolean {
    return this.licensProduct.some(item => item.sku === sku);
  }

  ngOnInit() {
    //usereknek a lekérése és ellenőrzése
    this.fooldalService.getAllUsers().subscribe(s => {
      for (const [key, value] of Object.entries(s)) {
        if (key === 'data') {
          for (let i in value) {
            const user = {
              name: '',
              roles: ''
            };
            user.name = value[i].attributes.name;
            for (let j in value[i].relationships) {
              for (let k in value[i].relationships.roles.data) {
                if (value[i].relationships.roles.data[k].meta.drupal_internal__target_id) {
                  user.roles = value[i].relationships.roles.data[k].meta.drupal_internal__target_id;
                }
              }
            }
            if (localStorage.getItem('login')) {
              // Olvassa ki a 'login' kulcs alatt tárolt JSON adatot
              const loginData = JSON.parse(localStorage.getItem('login') || '');

              // Ellenőrizze, hogy az adatok tartalmaznak-e 'name' mezőt
              if (loginData && loginData.current_user && loginData.current_user.name) {
                const name = loginData.current_user.name;
                //console.log('Felhasználó neve:', name);
                //console.log(user.name)

              } else {
                //console.log('A login adatok nem tartalmazzák a felhasználó nevét.');
              }
            } else {
              //console.log('A "login" kulcs nem található a localStorage-ban.');
            }
          }
        }
      }
    })

    //promoció
    this.fooldalService.getPromotions().subscribe(p => {
      for (const [key, value] of Object.entries(p)) {
        if (key === 'data') {
          for (let i in value) {
            console.log(value[i]);
            this.promotionObject = {
              name: '',
              roles: '',
              percentage: ''
            }
            this.promotionObject.name = value[i].attributes.name;
            if (value[i].attributes.conditions.length > 0) {
              const rolesObject = value[i].attributes.conditions[0].target_plugin_configuration.roles;
              const propertyNames = Object.keys(rolesObject);
              if (propertyNames.length > 0) {
                this.promotionObject.roles = rolesObject[propertyNames[0]].toString();
              }
            }
            if (value[i].attributes.offer.target_plugin_configuration.percentage) {
              this.promotionObject.percentage = value[i].attributes.offer.target_plugin_configuration.percentage;
            }
            this.promotionsArray.push(this.promotionObject);
          }
        }
      }
      console.log(this.promotionsArray);
      for (let i in this.promotionsArray) {
        this.promRole.push(this.promotionsArray[i].roles);
      }
      //bejelentkezve van e
      const isAuthenticated = this.authService.isAuthenticated();
      if (isAuthenticated) {
        this.loggedUser = JSON.parse(isAuthenticated);
        for (let j in this.loggedUser.current_user.roles) {
          var loggedProm = this.loggedUser.current_user.roles[j]
          for (let i in this.promRole) {
            if(this.promRole[i] === loggedProm){
             
              this.percentage = Number(this.promotionObject.percentage);
              console.log(this.percentage);
            }
          }
        }
      }
    });



    //feliratkozott kurzusok
    this.fooldalService.enrolledUser().subscribe((course) => {
      //console.log(course);
      const obj = {
        title: '',
        cid: '',
        uuid: ''
      };
      for (const [key, value] of Object.entries(course)) {
        for (let c in value) {
          for (let v in value[c]) {
            if (v === 'title') {
              obj.title = value[c][v][0].value;
            }
            if (v === 'cid') {
              obj.cid = value[c][v][0].value;
              this.shared.setCID(obj.cid);
            }
            if (v === 'uuid') {
              obj.uuid = value[c][v][0].value;
            }
          }
        }
      }
      this.courseDetails.push(obj);

    });

    //active licenszzek
    this.fooldalService.enrolledCourseLicens().subscribe(s => {
      for (let j in this.courseDetails) {
        var uuid = this.courseDetails[j].uuid;
        for (const [key, value] of Object.entries(s)) {
          if (key === 'data') {
            for (let i in value) {
              if (value[i].state === 'active') {
                this.active = true;
                const obj = {
                  title: '',
                  uuid: '',
                  videostore: false,
                  end_date: ''
                };
                if (value[i].product_variation.product_id.type === 'product--videostore') {
                  obj.videostore = true;
                }
                // Módosított feltétel: Mindig hozzáadja az objektumot, ha az adott elem aktív
                if (value[i].product_variation.product_id.field_course) {
                  obj.uuid = value[i].product_variation.product_id.field_course.id;
                }
                obj.title = value[i].product_variation.product_id.title;
                obj.end_date = value[i].expires.substring(0, 10);
                this.courseDetailsExpires.push(obj);
              }
            }
          }
        }
      }
    });


    this.fooldalService.getAllProducts().subscribe(s => {
      for (const [key, value] of Object.entries(s)) {
        if (key === 'data') {
          for (let i in value) {
            const objProduct = {
              title: '',
              month: '',
              list_price: '',
              price: '',
              desc: '' as SafeHtml,
              type: '',
              type_id: ''
            };

            if (value[i].body !== null) {
              const convert = this.htmlconvertService.convertToHtml(value[i].body.value);
              objProduct.desc = convert;
            }
            if (value[i].variations.length > 0) {
              objProduct.type = value[i].variations[0].type;
              objProduct.type_id = value[i].variations[0].id;
            }

            for (let j in value[i].variations[0]) {
              const regex = /(.+?) - (\d+ hónap)/;
              const founded = value[i].variations[0].title.match(regex);
              if (founded) {
                const cutTitle = founded[1].trim();
                const cutMonth = founded[2].trim();
                objProduct.title = cutTitle;
                objProduct.month = cutMonth;
              }
              objProduct.price = value[i].variations[0].price.formatted;
              for (let k in value[i].variations[0].list_price) {
                if (value[i].variations[0].list_price.formatted) {
                  objProduct.list_price = value[i].variations[0].list_price.formatted;
                }
              }

            }
            if (Object.values(objProduct).some(value => value !== '')) {
              this.products.push(objProduct);
            }

          }
        }
      }
    });

    this.fooldalService.getAllVideoStoreProducts().subscribe(s => {
      for (const [kkk, vvv] of Object.entries(s)) {
        if (kkk === 'data') {
          for (let l in vvv) {
            for (let x in vvv[l].variations) {
              if (vvv[l].variations[x].sku !== 'VTFREE') {
                const objProduct = {
                  title: '',
                  month: '',
                  list_price: '',
                  price: '',
                  desc: '' as SafeHtml,
                  type: '',
                  type_id: ''
                };
                if (vvv[l].body !== null) {
                  const convert = this.htmlconvertService.convertToHtml(vvv[l].body.value);
                  objProduct.desc = convert;
                }
                objProduct.type = vvv[l].variations[x].type;
                objProduct.type_id = vvv[l].variations[x].id;
                const regex = /(.+?) - (\d+ hónap)/;
                const founded = vvv[l].variations[x].title.match(regex);
                if (founded) {
                  const cutTitle = founded[1].trim();
                  const cutMonth = founded[2].trim();
                  objProduct.title = cutTitle;
                  objProduct.month = cutMonth;
                }
                if (vvv[l].variations[x].list_price !== null) {
                  objProduct.list_price = vvv[l].variations[x].list_price.formatted;
                }
                objProduct.price = vvv[l].variations[x].price.formatted;
                console.log(this.percentage);
                if (Object.values(objProduct).some(value => value !== '')) {
                  this.products.push(objProduct);
                }
              }
            }
          }
        }
      }
    });


    //nem feliratkozott kurzusok
    this.fooldalService.nonEnrolledUser().subscribe((user) => {

      for (const [key, value] of Object.entries(user)) {
        if (key === 'courses') {
          for (let i in value) {
            const obj = {
              title: value[i].title[0].value,
              uuid: value[i].uuid[0].value
            };
            this.courseNonEnrollmentDetails.push(obj);
          }
        }
      }

      // Most itt használjuk a nonEnrollmentDetails tömböt
      this.fooldalService.enrolledCourseLicens().subscribe((enrolled) => {
        for (const [key, value] of Object.entries(enrolled)) {
          if (key === 'data') {
            for (let i in value) {
              if (value[i].state === 'active') {
                const licensObj = {
                  title: '',
                  sku: ''
                }
                licensObj.title = value[i].product_variation.title;
                licensObj.sku = value[i].product_variation.sku;
                this.licensProduct.push(licensObj);
              }
            }
          }
        }

      });
      this.fooldalService.getAllProducts().subscribe((productDefault) => {
        for (const [kk, vv] of Object.entries(productDefault)) {
          if (kk === 'data') {
            for (let j in vv) {
              var productsObj = {
                title: '',
                sku: '',
                desc: '' as SafeHtml,
                list_price: '',
                price: '',
                month: '',
                type: '',
                type_id: ''
              }
              productsObj.type = vv[j].variations[0].type;
              productsObj.type_id = vv[j].variations[0].id;
              productsObj.sku = vv[j].variations[0].sku;
              if (vv[j].body) {
                const convert = this.htmlconvertService.convertToHtml(vv[j].body.value);
                productsObj.desc = convert;
              }
              if (vv[j].variations[0].list_price !== null) {
                productsObj.list_price = vv[j].variations[0].list_price.formatted;
              }
              console.log(vv[j].variations[0].price.formatted);
              const split = vv[j].variations[0].price.formatted.split(',');
              const priceToConvert = split[0].replace(/\s/g, '');
              const price = Number(priceToConvert);
              console.log(this.percentage);
              console.log(price);
              const per10 = price * this.percentage;
              const pricePer10minus = price - per10;
              console.log(pricePer10minus);
              const formattedString = pricePer10minus.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace('.', ',');
              productsObj.price = formattedString;

              const regex = /(.+?) - (\d+ hónap)/;
              const founded = vv[j].variations[0].title.match(regex);
              if (founded) {
                const cutTitle = founded[1].trim();
                const cutMonth = founded[2].trim();
                productsObj.title = cutTitle;
                productsObj.month = cutMonth;
              }
              this.productsForLicens.push(productsObj);
              console.log(this.productsForLicens);

            }
          }
        }
        this.productsForLicens.forEach(productsObj => {
          if (!this.licensProduct.some(item => item.sku === productsObj.sku) &&
            !this.courseNonEnrollmentsDetailsExpires.some(item => item.sku === productsObj.sku)) {
            console.log(productsObj);
            console.log(this.licensProduct)
            this.courseNonEnrollmentsDetailsExpires.push(productsObj);
          }
        });
        console.log(this.courseNonEnrollmentsDetailsExpires);
      });
      this.fooldalService.getAllVideoStoreProducts().subscribe((productDefault) => {
        for (const [kkk, vvv] of Object.entries(productDefault)) {
          if (kkk === 'data') {
            for (let j in vvv) {
              for (let x in vvv[j].variations) {
                var productVidObj = {
                  title: '',
                  sku: '',
                  desc: '' as SafeHtml,
                  list_price: '',
                  price: '',
                  month: '',
                  type: '',
                  type_id: ''
                }
                console.log(vvv[j]);
                productVidObj.type = vvv[j].variations[x].type;
                productVidObj.type_id = vvv[j].variations[x].id;
                productVidObj.sku = vvv[j].variations[x].sku;
                if (vvv[j].body) {
                  const convert = this.htmlconvertService.convertToHtml(vvv[j].body.value);
                  productVidObj.desc = convert;
                }
                if (vvv[j].variations[x].list_price !== null) {
                  productVidObj.list_price = vvv[j].variations[x].list_price.formatted;
                }
                const split = vvv[j].variations[x].price.formatted.split(',');
                const priceToConvert = split[0].replace(/\s/g, '');
                const price = Number(priceToConvert);
                console.log(this.percentage);
                console.log(price);
                const per10 = price * this.percentage;
                const pricePer10minus = price - per10;
                console.log(pricePer10minus);
                const formattedString = pricePer10minus.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace('.', ',');
                productVidObj.price = formattedString;
                const regex = /(.+?) - (\d+ hónap)/;
                const founded = vvv[j].variations[x].title.match(regex);
                if (founded) {
                  const cutTitle = founded[1].trim();
                  const cutMonth = founded[2].trim();
                  productVidObj.title = cutTitle;
                  productVidObj.month = cutMonth;
                }
                this.productsVidForLicens.push(productVidObj);
                console.log(this.productsVidForLicens);
              }
            }
          }
        }
        this.productsVidForLicens.forEach(productsObj => {
          if (!this.licensProduct.some(item => item.sku === productsObj.sku) &&
            !this.vidCourseNonEnrollmentsDetailsExpires.some(item => item.sku === productsObj.sku)) {
            this.vidCourseNonEnrollmentsDetailsExpires.push(productsObj);
            console.log(this.vidCourseNonEnrollmentsDetailsExpires);
          }
        });
      });
    });


    //kurzusok kiirása, amikor nincs bejelentkezve
    this.fooldalService.getCourses().subscribe(c => {
      for (const [key, value] of Object.entries(c)) {
        if (key === 'courses') {
          for (let i in value) {
            const objCourse = {
              title: value[i].title[0].value,
              uuidCourse: value[i].uuid[0].value
            };
            this.course.push(objCourse);

          }
        }
      }
    });
  }



  ngOnDestroy() {
    if (this.loggedInUserSubscription) {
      this.loggedInUserSubscription.unsubscribe();
    }
  }

}
