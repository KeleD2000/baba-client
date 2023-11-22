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
  course: any[] = [];
  courseCommercie: any[] = [];
  products: any[] = [];
  private loggedInUserSubscription?: Subscription;
  loggedUser: any;
  postDataProducts: any = {};
  active: boolean = false;
  productDatas: any = {};
  cuoponDatas: any = {};
  licensProduct: any[] = [];
  productsForLicens: any[] = [];

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



    //bejelentkezve van e
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      this.loggedUser = JSON.parse(isAuthenticated);
      //console.log(this.loggedUser);
    }

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
                console.log(this.courseDetailsExpires)
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
      console.log(this.products);
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
                console.log(value[i]);
                const licensObj = {
                  title: '',
                  sku: ''
                }
                licensObj.title = value[i].product_variation.title;
                licensObj.sku = value[i].product_variation.sku;
                this.licensProduct.push(licensObj);
                console.log(this.licensProduct)
                this.productsForLicens.forEach(productsObj => {
                  if (productsObj.sku != licensObj.sku) {
                    console.log(`Nem Egyező SKU: ${productsObj.sku}`);
                    console.log(productsObj);
                    this.courseNonEnrollmentsDetailsExpires.push(productsObj);
                  }
                });
              }

            }
          }
        }
        
      });
      this.fooldalService.getAllProducts().subscribe((productDefault) => {
        for (const [kk, vv] of Object.entries(productDefault)) {
          if (kk === 'data') {
            for (let j in vv) {
              console.log(vv[j].variations[0]);
              var productsObj = {
                title: '',
                sku: '',
                desc: '' as SafeHtml,
                list_price: '',
                price: '',
                month: ''
              }
              productsObj.sku = vv[j].variations[0].sku;
              if (vv[j].body) {
                const convert = this.htmlconvertService.convertToHtml(vv[j].body.value);
                productsObj.desc = convert;
              }
              if (vv[j].variations[0].list_price !== null) {
                productsObj.list_price = vv[j].variations[0].list_price.formatted;
              }
              productsObj.price = vv[j].variations[0].price.formatted;
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
      });
      this.fooldalService.getAllVideoStoreProducts().subscribe((productDefault) => {
        for (const [kkk, vvv] of Object.entries(productDefault)) {
          if (kkk === 'data') {
            for (let j in vvv) {
              console.log(vvv[j].variations[0]);
              for (let x in vvv[j].variations) {
                console.log(vvv[j].variations[x]);
                var productsObj = {
                  title: '',
                  sku: '',
                  desc: '' as SafeHtml,
                  list_price: '',
                  price: '',
                  month: ''
                }
                productsObj.sku = vvv[j].variations[x].sku;
                if (vvv[j].body) {
                  const convert = this.htmlconvertService.convertToHtml(vvv[j].body.value);
                  productsObj.desc = convert;
                }
                if (vvv[j].variations[x].list_price !== null) {
                  productsObj.list_price = vvv[j].variations[x].list_price.formatted;
                }
                productsObj.price = vvv[j].variations[x].price.formatted;
                const regex = /(.+?) - (\d+ hónap)/;
                const founded = vvv[j].variations[x].title.match(regex);
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
        }
      });

      /*this.fooldalService.enrolledCourseLicens().subscribe(s => {
        for (const [key, value] of Object.entries(s)) {
          if (key === 'data') {
            for (let i in value) {
              if (value[i].product_variation.type !== 'unknown') {
                if (value[i].state === 'pending' || value[i].state === 'canceled') {
                  const obj = {
                    uuid: '',
                    title: '',
                    describe: '' as SafeHtml,
                    price: '',
                    discount_price: '',
                    month: '',
                    type: '',
                    type_id: ''

                  };
                  console.log();
                  if (value[i].product_variation.product_id) {
                    obj.type = value[i].product_variation.product_id.variations[0].type;
                    obj.type_id = value[i].product_variation.product_id.variations[0].id;
                    obj.uuid = value[i].product_variation.product_id.field_course.id;
                    const regex = /(.+?) - (\d+ hónap)/;
                    const founded = value[i].product_variation.product_id.variations[0].title.match(regex);
                    if (founded) {
                      const cutTitle = founded[1].trim();
                      const cutMonth = founded[2].trim();
                      obj.title = cutTitle;
                      obj.month = cutMonth;
                    }
                    obj.describe = this.htmlconvertService.convertToHtml(value[i].product_variation.product_id.body.value);
                    for (let j in value[i].product_variation.list_price) {
                      if (value[i].product_variation.list_price) {
                        obj.price = value[i].product_variation.list_price.formatted;
                      }
                    }
                    for (let j in value[i].product_variation.price) {
                      obj.discount_price = value[i].product_variation.price.formatted;
                    }
                  }
                  this.courseNonEnrollmentsDetailsExpires.push(obj);
                }
              }
            }
          }
        }
      });*/
      /*
      this.fooldalService.enrolledCourseLicens().subscribe(s => {
        for (const [key, value] of Object.entries(s)) {
          if (key === 'data') {
            for (let i in value) {
              var commerceUuid = value[i].product_variation.product_id.field_course.id
              for (let j in this.course) {
                const objC = {
                  title: '',
                  price: '',
                  discount_price: '',
                  s_length_number: '',
                  s_length_m_y: ''
                }
                if (this.course[j].uuidCourse === commerceUuid) {
                  objC.title = this.course[j].title;
                  for (let j in value[i].product_variation.list_price) {
                    objC.price = value[i].product_variation.list_price.formatted;
                    objC.discount_price = value[i].product_variation.price.formatted;
                  }
                  for (let j in value[i].expiration_type.target_plugin_configuration.interval) {
                    objC.s_length_number = value[i].expiration_type.target_plugin_configuration.interval.interval;
                    objC.s_length_m_y = value[i].expiration_type.target_plugin_configuration.interval.period;
                  }
                  if (Object.values(objC).some(value => value !== '')) {
                    this.courseCommercie.push(objC);
                  }
                }
              }
            }
          }
        }
      })
      console.log(this.courseCommercie);
  */
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
