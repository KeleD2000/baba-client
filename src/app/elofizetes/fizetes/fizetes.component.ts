import { Component } from '@angular/core';

@Component({
  selector: 'app-fizetes',
  templateUrl: './fizetes.component.html',
  styleUrls: ['./fizetes.component.css']
})
export class FizetesComponent {
  toPayProduct : any[] = [];

  ngOnInit(){
    const obj = {
      title: '',
      price: ''
    }
    if(localStorage.getItem('product')){
      var current = JSON.parse(localStorage.getItem('product')!)
    }
    obj.title = current.title;
    obj.price = current.price;
    this.toPayProduct.push(obj)
    console.log(this.toPayProduct);
  }

}
