import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FooldalService } from 'src/app/services/fooldal.service';

@Component({
  selector: 'app-osszegzes',
  templateUrl: './osszegzes.component.html',
  styleUrls: ['./osszegzes.component.css']
})
export class OsszegzesComponent {
  toPayProduct: any[] = [];
  profileCustomer: any[] = [];
  isPinkFill1: boolean = false;
  isPinkFill2: boolean = false;
  orderId: string = '';
  cuoponPrice: any[] = [];
  paypal: boolean = false;


  constructor(private fooldalService: FooldalService) { }

  toggleColors(circleNumber: number) {
    if (circleNumber === 1) {
      this.isPinkFill1 = true;
      this.isPinkFill2 = false;
    } else if (circleNumber === 2) {
      this.isPinkFill2 = true;
      this.isPinkFill1 = false;
    }
  }

  onSimplePayClick() {
    console.log("SimplePay");
  }

  onPayPalClick() {
    this.paypal = true;
    console.log(this.paypal);
  }

  Pay() {
    if (this.paypal) {
      const body = new HttpParams().set('grant_type', 'client_credentials');
      this.fooldalService.getPayPalAccesToken(body.toString()).subscribe(p => {
        for (const [key, value] of Object.entries(p)) {
          console.log(key, value);
          if (key === "access_token") {
            var accessToken = value;
            for (let i in this.toPayProduct) {
              var productTitle = this.toPayProduct[i].title;
            }
            for(let j in this.cuoponPrice){
              var productPrice = this.cuoponPrice[j].current;
              var withoutSpace  = productPrice.replace(/\s+/g, '').replace('Ft', '');
              var convertedPrice = withoutSpace.replace(',', '.');
            }
            this.fooldalService.getAllProducts().subscribe( s => {
              for(const [k,v] of Object.entries(s)){
                if(k === 'data'){
                  for(let j in v){
                    if(v[j].title === productTitle){
                      console.log(v[j].body.value.toString());
                      const createPayPal = {
                        "intent" : "CAPTURE",
                        "purchase_units" : [
                          {
                            "items" : [
                              {
                                "name" : v[j].title,
                                "description" : v[j].title,
                                "quantity" : "1",
                                "unit_amount" : {
                                  "currency_code" : "HUF",
                                  "value" : convertedPrice
                                }
                              }
                            ],
                            "amount" : {
                              "currency_code" : v[j].variations[0].price.currency_code,
                              "value" : convertedPrice,
                              "breakdown" : {
                                "item_total" : {
                                  "currency_code" : v[j].variations[0].price.currency_code,
                                  "value" : convertedPrice
                                }
                              }
                            }
                          }
                        ],
                        "application_context" : {
                          "return_url" : "http://localhost:4200/sikeres_fizetes",
                          "cancel_url" : "http://localhost:4200/sikertelen_fizetes"
                        }
                      }
                      console.log(createPayPal);
                      console.log(accessToken);
                      this.fooldalService.createPayPalOrder(createPayPal, accessToken).subscribe( p => {
                        for(const [kk, vv] of Object.entries(p)){
                          if(kk === 'id'){
                            localStorage.setItem('paypalApi', vv);
                          }
                          if(kk === 'links'){
                            for(let k in vv){
                              window.location.href = vv[1].href;
                              
                            }
                          }
                        }
                      });
                    }
                  }
                }
              }
            });
            this.fooldalService.getHallSessionProduct().subscribe( s => {
              for(const [k,v] of Object.entries(s)){
                if(k === 'data'){
                  for(let j in v){
                    if(v[j].title === productTitle){
                      console.log(v[j].body.value.toString());
                      const createPayPal = {
                        "intent" : "CAPTURE",
                        "purchase_units" : [
                          {
                            "items" : [
                              {
                                "name" : v[j].title,
                                "description" : v[j].title,
                                "quantity" : "1",
                                "unit_amount" : {
                                  "currency_code" : "HUF",
                                  "value" : convertedPrice
                                }
                              }
                            ],
                            "amount" : {
                              "currency_code" : v[j].variations[0].price.currency_code,
                              "value" : convertedPrice,
                              "breakdown" : {
                                "item_total" : {
                                  "currency_code" : v[j].variations[0].price.currency_code,
                                  "value" : convertedPrice
                                }
                              }
                            }
                          }
                        ],
                        "application_context" : {
                          "return_url" : "http://localhost:4200/sikeres_fizetes",
                          "cancel_url" : "http://localhost:4200/sikertelen_fizetes"
                        }
                      }
                      console.log(createPayPal);
                      console.log(accessToken);
                      this.fooldalService.createPayPalOrder(createPayPal, accessToken).subscribe( p => {
                        for(const [kk, vv] of Object.entries(p)){
                          if(kk === 'id'){
                            localStorage.setItem('paypalApi', vv);
                          }
                          if(kk === 'links'){
                            for(let k in vv){
                              window.location.href = vv[1].href;
                              
                            }
                          }
                        }
                      });
                    }
                  }
                }
              }
            });
          }
        }

      });
    } else {
      console.log("Más fizetés");
    }

  }

  ngOnInit() {

    const obj = {
      title: '',
      price: ''
    }
    const objProductPrice = {
      cuopon_price: '',
      cuopon_name: '',
      current: ''
    }
    if (localStorage.getItem('product')) {
      var current = JSON.parse(localStorage.getItem('product')!)
    }
    var productTitle = current.title;
    obj.title = current.title;
    obj.price = current.price;
    this.toPayProduct.push(obj)
    console.log(this.toPayProduct);

    this.fooldalService.getAllUsers().subscribe(p => {
      const objProfile = {
        id: '',
        name: '',
        country: '',
        county: '',
        postal_code: '',
        city: '',
        address: '',
        email: ''
      };

      let objId = ''; // Új változó az obj.id helyett

      for (const [key, valuee] of Object.entries(p)) {
        if (key === 'data') {
          for (let i in valuee) {
            if (localStorage.getItem('login')) {
              const loginData = JSON.parse(localStorage.getItem('login') || '');
              if (loginData && loginData.current_user && loginData.current_user.name) {
                var name = loginData.current_user.name // Az új változóba helyezzük az id-t
                objProfile.name = valuee[i].attributes.name;
                objProfile.email = valuee[i].attributes.mail;
                if (name === objProfile.name) {
                  var mail = objProfile.email;
                  objId = valuee[i].id;
                  this.fooldalService.getProfileCustomer().subscribe(p => {
                    for (const [key, value] of Object.entries(p)) {
                      if (key === 'data') {
                        for (let i in value) {
                          objProfile.id = value[i].relationships.uid.data.id;
                          if (objProfile.id === objId) { // Az új változót használjuk itt
                            objProfile.name = value[i].attributes.address.family_name + " " + value[i].attributes.address.given_name;
                            objProfile.country = value[i].attributes.address.country_code;
                            objProfile.postal_code = value[i].attributes.address.postal_code;
                            objProfile.city = value[i].attributes.address.locality;
                            objProfile.address = value[i].attributes.address.address_line1 + " " + value[i].attributes.address.address_line2;
                            objProfile.email = mail;
                          }
                        }
                      }
                    }

                    this.profileCustomer.push(objProfile);
                  });
                }
              }
            }
          }
        }
      }
    });
    const pIdLocalS = localStorage.getItem('productId');
    if (pIdLocalS !== null) {
      this.orderId = pIdLocalS;
    }
    this.fooldalService.getProductById(this.orderId).subscribe((order) => {
      for (const [key, value] of Object.entries(order)) {
        if (key === 'data') {
          objProductPrice.current = value.order_total.total.formatted;
          if (value.order_total.adjustments.length > 0) {
            objProductPrice.cuopon_name = value.order_total.adjustments[0].label;
            objProductPrice.cuopon_price = value.order_total.adjustments[0].amount.formatted;
          }
          this.cuoponPrice.push(objProductPrice);
        }
      }
    });
    console.log(this.cuoponPrice);
  }

}
