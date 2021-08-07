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
      }
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }

  buyBtnClick(item: any){
    localStorage.setItem(LocalStorage.PRODUCT_PRICE, item.price);
    localStorage.setItem(LocalStorage.PRODUCT_ID, item.id);
    localStorage.setItem(LocalStorage.PRODUCT_NAME, item.title);
    this.router.navigateByUrl('/payment')
  }
}
