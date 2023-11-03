import { Component, Input } from '@angular/core';
import { FooldalService } from 'src/app/services/fooldal.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-fizetes',
  templateUrl: './fizetes.component.html',
  styleUrls: ['./fizetes.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(300)]),
      transition(':leave', animate(300, style({ opacity: 0 })))
    ])
  ]
})
export class FizetesComponent {
  toPayProduct: any[] = [];
  profileCustomer: any[] = [];
  cuoponDatas: any = {};
  public orderId: string = "";
  inputText: string = '';
  succesfull: boolean | null = null;
  used: boolean | null = null;
  usedCuopons: any[] = [];

  constructor(private fooldalService: FooldalService) { }

  ngOnInit() {
    const obj = {
      title: '',
      price: ''
    }
    if (localStorage.getItem('product')) {
      var current = JSON.parse(localStorage.getItem('product')!)
    }
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
                    console.log(this.profileCustomer);
                  });
                }
              }
            }
          }
        }
      }
    });
  }

  
  addCuopon() {
    const objCuopon = {
      code : '',
      type: '',
      id : ''
    }
    this.cuoponDatas = {
      "data": [
        {
          "type": "promotion-coupon",
          "id": "0923d283-ba5a-423d-b5db-c6caae07128b"

        }
      ]
    }
    console.log(this.cuoponDatas);
    const pIdLocalS = localStorage.getItem('productId');
    if(pIdLocalS !== null){
      this.orderId = pIdLocalS;
    }
    console.log(this.orderId);
    this.fooldalService.getAllCuopons().subscribe((c) => {
      for(const [key, value] of Object.entries(c)){
        if(key === 'data'){
          for(let i in value){
            objCuopon.code = value[i].attributes.code;
            objCuopon.type = value[i].type;
            objCuopon.id = value[i].id;
          }
          console.log(this.inputText);
          console.log(objCuopon.code);
          
          if (this.usedCuopons.includes(this.inputText)) {
            this.succesfull = false;
            console.log("Sikertelen kupon, már használták");
          } else if (this.inputText === objCuopon.code){
            this.succesfull = true;
            this.usedCuopons.push(this.inputText);
            this.fooldalService.addCuopon(this.cuoponDatas, this.orderId).subscribe(c => {
              console.log("Sikeres kupon aktiválás");
            });
          } else {
            this.succesfull = false;
            console.log("Sikertelen kupon");
          }
        }
      }
    });
    


  }

}
