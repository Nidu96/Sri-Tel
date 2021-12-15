import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { Product } from '../models/product.model';
import { ProductService } from '../admin/product/product.service';
import { AlertService } from '../alert/alert.service';
import { LocalStorage } from '../util/localstorage.service';
import { Router } from '@angular/router';
import { CategoryService } from '../admin/category/category.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})


export class ProductsComponent implements OnInit {
  public productlist: Array<any> = []
  public categorylist: Array<Category> = []
  public showproducts: boolean = false;
  public pproducts: number = 1;
  public productcount: number = 0;
  public category: string = "all";
  public selectedCattitle: string = "All Products"
  public selectedProductCount: number = 0;
  public allProductsCount: number = 0;

  constructor(private productService: ProductService,private alertService: AlertService,
    private categoryService: CategoryService,private router: Router) { }

  ngOnInit() {
    AOS.init();
    if(this.router.url === '/products'){
      document.body.style.backgroundImage = "url('assets/images/banner2.jpg')"; 
      document.body.className = "products-body"
    }
    this.productlist = []
    this.GetCategories()
    this.GetProducts(0)
    this.GetProductsCount()
    localStorage.setItem(LocalStorage.LANDING_BODY, "1");
  }

  GetProducts(startlimit){
    this.showproducts = false
    if(this.productlist == undefined){
      this.productlist = []
    }
    this.productService.getproducts(startlimit.toString(),"15").subscribe(data => {
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
    });
  }

  GetProductsCount(){
      this.productService.getallproductscount().subscribe(data => {
        this.allProductsCount = data[0].ProductCount
        this.selectedProductCount = this.allProductsCount
      },
      error => { 
          this.alertService.clear()
      });
      
  }

  GetProductsByCategory(category){
    this.showproducts = false
    this.productlist = []
    if(category != undefined && category != null && category != ""){
      this.selectedCattitle = category.Title
      this.selectedProductCount = category.ProductCount
      this.productService.getproductoncategory(category).subscribe(data => {
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
      });
    }
  }

  GetCategories(){
    this.categoryService.getcategories("0","100").subscribe(data => {
      this.categorylist = data
      if(this.categorylist != null && this.categorylist != undefined){
        if(this.categorylist.length != 0){
          this.categorylist.forEach(element => {
            this.productService.getproductscount(element).subscribe(d => {
              element.ProductCount = d[0].ProductCount
            },
            error => { 
              this.alertService.clear()
            });
          });
        }
      }
    },
    error => { 
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
        TotalPrice:e.Price,Weight:e.Weight,TotalWeight:e.Weight,Quantity:1,Description:e.Description,DatePublished:e.DatePublished})
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
      var tempcount = Math.abs(event-1.5) * 15
      if(event == 1) tempcount = 0
      this.GetProducts(tempcount) 
    } 
    this.pproducts = event
    this.productcount = event
  }
}
