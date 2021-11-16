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
  public pproducts: number = 1;
  public productcount: number = 0;

  constructor(private productService: ProductService,private alertService: AlertService,private router: Router) { }

  ngOnInit() {
    AOS.init();
    this.productlist = []
    this.GetProducts(0)
    localStorage.setItem(LocalStorage.LANDING_BODY, "1");
  }

  GetProducts(startlimit){
    this.showproducts = false
    if(this.productlist == undefined){
      this.productlist = []
    }
    this.productService.getproducts(startlimit.toString(),"10").subscribe(data => {
      data.forEach(element => {
        var i = this.productlist.findIndex(x=> x.Id  === element.Id)
        if(this.productlist.findIndex(x=> x.Id  === element.Id) == -1){
          this.productlist.push(element)
        }
      });
      if(this.productlist != null && this.productlist != undefined && this.productlist.length != 0){
        this.showproducts = true
        this.productlist = this.productService.refreshProductList(this.productlist)
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
    var tempproductarr = []
    selectedProducts.forEach(e => {
      tempproductarr.push({Id:e.Id,CategoryId:e.CategoryId,Title:e.Title,Image:e.Image,ImageFile:e.ImageFile,Price:e.Price,
        Quantity:0,Description:e.Description,DatePublished:e.DatePublished})
    });
    selectedProducts = tempproductarr
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

  pagination(event){
    if(this.productcount < event){
      var tempcount = Math.abs(event-1.5) * 10
      if(event == 1) tempcount = 0
      this.GetProducts(tempcount) 
    } 
    this.pproducts = event
    this.productcount = event
  }
}
