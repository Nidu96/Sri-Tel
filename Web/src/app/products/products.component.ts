import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { Product } from '../models/product.model';
import { ProductService } from '../admin/product/product.service';
import { AlertService } from '../alert/alert.service';
import { LocalStorage } from '../util/localstorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})


export class ProductsComponent implements OnInit {
  public productlist: Array<any> = []
  public showproducts: boolean = false;
  
  constructor(private productService: ProductService,private alertService: AlertService,private router: Router) { }

  ngOnInit() {
    AOS.init();
    this.GetProducts()
    localStorage.setItem(LocalStorage.LANDING_BODY, "1");
  }

  GetProducts(){
    this.showproducts = false
    this.productlist = []
    this.productService.getproducts().subscribe(data => {
      this.productlist = data
      if(this.productlist != null && this.productlist != undefined && this.productlist.length != 0){
        this.showproducts = true
        this.productlist.forEach(e => {e.IsAddedToCart = false;});
      }
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }

  addToCartBtnClick(item: any){
    let selectedProducts = [] 
    let temp = localStorage.getItem(LocalStorage.SHOPPING_CART)
    if(temp != undefined && temp != null && temp != ""){
      selectedProducts = JSON.parse(localStorage.getItem(LocalStorage.SHOPPING_CART));
    }
    selectedProducts.push(item)
    item.IsAddedToCart = true
    localStorage.setItem(LocalStorage.SHOPPING_CART, JSON.stringify(selectedProducts));
    this.productService.refreshshoppingcart();
    // this.router.navigateByUrl('/payment')
  }

  removeFromCartBtnClick(item: any){
    let selectedProducts = [] 
    let temp = localStorage.getItem(LocalStorage.SHOPPING_CART)
    if(temp != undefined && temp != null && temp != ""){
      selectedProducts = JSON.parse(localStorage.getItem(LocalStorage.SHOPPING_CART));
    }
    if(selectedProducts != null && selectedProducts != undefined && selectedProducts.length != 0){
      selectedProducts.splice(item, 1)
      item.IsAddedToCart = false
    }
    localStorage.setItem(LocalStorage.SHOPPING_CART, JSON.stringify(selectedProducts));
    this.productService.refreshshoppingcart();
    // this.router.navigateByUrl('/payment')
  }
}
