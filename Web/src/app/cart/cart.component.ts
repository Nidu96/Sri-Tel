import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { LocalStorage } from '../util/localstorage.service';
import { ProductService } from '../admin/product/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public selectedProducts: Array<any>;
  public emptyCart: boolean = true;
  public name: string;
  public phone: string;
  public address: string;
  public notes: string;
  public city: string;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    AOS.init();

    let temp = localStorage.getItem(LocalStorage.SHOPPING_CART)
    this.selectedProducts = [];
    if(temp != undefined && temp != null && temp != ""){
      this.selectedProducts = JSON.parse(localStorage.getItem(LocalStorage.SHOPPING_CART));
    }

    if(this.selectedProducts == null || this.selectedProducts == undefined || this.selectedProducts.length == 0){
      this.emptyCart = true;
    }else{
      this.emptyCart = false;
    }
  }

  removeFromCartBtnClick(item: any){
    this.selectedProducts = [] 
    let temp = localStorage.getItem(LocalStorage.SHOPPING_CART)
    if(temp != undefined && temp != null && temp != ""){
      this.selectedProducts = JSON.parse(localStorage.getItem(LocalStorage.SHOPPING_CART));
    }
    if(this.selectedProducts != null && this.selectedProducts != undefined && this.selectedProducts.length != 0){
      this.selectedProducts.splice(item, 1)
    }
    localStorage.setItem(LocalStorage.SHOPPING_CART, JSON.stringify(this.selectedProducts));
    this.productService.refreshshoppingcart();
    if(this.selectedProducts == null || this.selectedProducts == undefined || this.selectedProducts.length == 0){
      this.emptyCart = true;
    }
    // this.router.navigateByUrl('/payment')
  }

  ContinueToPayment(){
    
  }
}
