import { Component, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription, subscribeOn } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CuoponIdService } from 'src/app/services/cuopon-id.service';
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
  public cuoponIdProduct: string = "";



  constructor(private fooldalService: FooldalService, private shared: SharedService, 
    private htmlconvertService: HtmlconvertService, private authService: AuthService, 
    private router: Router, private cuoponId: CuoponIdService) {

  }

  addCart(type: any, id: any) {
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

    this.fooldalService.addItemToCart(this.postDataProducts).subscribe((p) => {
      console.log(this.postDataProducts);
      console.log(p);
      for (const [key, value] of Object.entries(p)) {
        if (key === 'data') {
          for (let i in value) {
            console.log(value[i]);
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
                      const loginData = JSON.parse(localStorage.getItem('login') || '');

                      if (loginData && loginData.current_user && loginData.current_user.name) {
                        var name = loginData.current_user.name;
                      }
                    }

                    if (name === objProf.name) {
                      var userId = vv[j].id;

                      this.fooldalService.getProfileCustomer().subscribe((profile) => {
                        for (const [k, v] of Object.entries(profile)) {
                          if (k === 'data') {
                            for (let j in v) {
                              if (userId === v[j].relationships.uid.data.id) {
                                console.log(v[j].attributes.address);
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
                        console.log(value[i].type);
                        console.log(value[i].id);
                        this.productDatas = {
                          data: {
                            type: value[i].relationships.order_id.data.type,
                            attributes: {
                              billing_information: {
                                address: {
                                  country_code: objBilling.country_code,
                                  locality: objBilling.locality,
                                  postal_code: objBilling.postal_code,
                                  address_line1: objBilling.address_line1,
                                  address_line2: objBilling.address_line2,
                                  given_name: objBilling.given_name,
                                  family_name: objBilling.family_name,
                                },
                                tax_number: {
                                  type: null,
                                  value: null,
                                },
                              },
                              order_total: {
                                subtotal: {
                                  number: value[i].attributes.total_price.number,
                                  currency_code: value[i].attributes.total_price.currency_code,
                                  formatted: value[i].attributes.total_price.formatted,
                                },
                                total: {
                                  number: value[i].attributes.total_price.number,
                                  currency_code: value[i].attributes.total_price.currency_code,
                                  formatted: value[i].attributes.total_price.formatted,
                                },
                              },
                              cart: true,
                              checkout_step: null,
                            },
                            relationships: {
                              order_type: {
                                data: {
                                  type: 'order-type',
                                  id: '8f6b2a8d-93d6-43a6-bcf8-a3df729a0365',
                                },
                              },
                              store_id: {
                                data: {
                                  type: 'store--online',
                                  id: '1592cb08-0724-4172-8406-eab6c557ae27',
                                },
                              },
                              uid: {
                                data: {
                                  type: 'user--user',
                                  id: userId,
                                },
                              },
                              order_items: {
                                data: [
                                  {
                                    type: value[i].type,
                                    id: value[i].id,
                                  },
                                ],
                              },
                            },
                          },
                        };
                        console.log(this.productDatas);
                        this.fooldalService.addProductWithCart(this.productDatas).subscribe(p => {
                          console.log(p);
                          console.log(this.productDatas);
                          for (const [keyP, valueP] of Object.entries(p)) {
                            if (keyP === 'data') {
                              for (let k in valueP) {
                                if(valueP.id){
                                  this.cuoponId.setCuopon(valueP.id);
                                }
                              }
                            }
                          }
                        })
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
                  end_date: ''
                };
                obj.uuid = value[i].product_variation.product_id.field_course.id;
                if (obj.uuid === uuid) {
                  obj.title = value[i].product_variation.product_id.title;
                  obj.end_date = value[i].expires.substring(0, 10);
                  this.courseDetailsExpires.push(obj); // Hozzáadja az objektumot csak akkor, ha az if feltétel teljesül
                }
              }
               console.log(this.active);
            }
          }
        }
        console.log(this.courseDetailsExpires);
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
              type: '',
              type_id: ''
            };
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
      //console.log(this.products);
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
      this.fooldalService.enrolledCourseLicens().subscribe(s => {
        for (const [key, value] of Object.entries(s)) {
          if (key === 'data') {
            for (let i in value) {
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
                this.courseNonEnrollmentsDetailsExpires.push(obj);
                console.log(this.courseNonEnrollmentsDetailsExpires);

              }
            }

          }

        }
        console.log(this.courseNonEnrollmentsDetailsExpires);
      });
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
 console.log(this.active);
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
