import { Component } from '@angular/core';
import { FooldalService } from 'src/app/services/fooldal.service';

@Component({
  selector: 'app-sikertelen-kurzus',
  templateUrl: './sikertelen-kurzus.component.html',
  styleUrls: ['./sikertelen-kurzus.component.css']
})
export class SikertelenKurzusComponent {
  toPayProduct: any[] = [];
  profileCustomer: any[] = [];

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
                          console.log(objProfile.id);
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


}
