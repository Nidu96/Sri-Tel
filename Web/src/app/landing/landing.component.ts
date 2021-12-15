import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as AOS from 'aos';
import { Router } from '@angular/router';
import { CategoryService } from '../admin/category/category.service';
import { Product } from '../models/product.model';
import { ProductService } from '../admin/product/product.service';
import { AlertService } from '../alert/alert.service';
import { LocalStorage } from '../util/localstorage.service';
import { BsModalService,BsModalRef}   from 'ngx-bootstrap/modal';
import { DateFormat, DateType, DateValidators  } from 'ngx-mat-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { Category } from '../models/category.model';
import { BannerService } from '../admin/banner/banner.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
@HostListener('window:scroll', ['$event'])
export class LandingComponent implements OnInit {
  public categorylist: Array<Category> = []
  public categorylisttoshow: Array<any> = []
  public categorylisttohidden: Array<Category> = []
  public showcategories: boolean = false;

  public productlist: Array<any> = []
  public showproducts: boolean = false;

  public bestsellersproductlist: Array<any> = []
  public showbestsellersproducts: boolean = false;

  public newarrivalsproductlist: Array<any> = []
  public shownewarrivalsproducts: boolean = false;

  public organicproduct1: string
  public organicproduct2: string
  public organicproduct3: string
  public showorganicproducts: boolean = false;

  public bannerlist: Array<any> = []
  public activeBanner: any;

  public viewDate: Date = new Date();
  public view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  public events: Array<CalendarEvent>

  public counter1: number

  constructor(private router: Router,private categoryService: CategoryService, 
    private productService: ProductService, private alertService: AlertService,
    private bannerService: BannerService,) { }

  ngOnInit() {
    this.activeBanner = ""
    this.GetCategories();
    this.GetProducts();
    this.GetBanners();
    AOS.init();
    localStorage.setItem(LocalStorage.LANDING_BODY, "1");

    
  }

  //#region navigation methods
  ShowServices(){
    this.router.navigateByUrl('services')
  }

  ShowGallery(){
    this.router.navigateByUrl('gallery')
  }
  //#endregion

  //#region get data methods
  GetCategories(){
    this.showcategories = false
    this.categoryService.getcategories("0","100").subscribe(data => {
      this.categorylist = data
      this.categorylisttoshow = []    
      if(data != null && data != undefined && data.length != 0){
        if(data.length >= 5){
          var i
          for(i = 0; i < 4; i++){
            this.categorylisttoshow.push({Id: data[i].Id,Title: data[i].Title,Image: data[i].Image,ImageFile: data[i].ImageFile,
              Description: data[i].Description,
              DatePublished: data[i].DatePublished, Hidden: false})
          }
          for(i = 4; i < data.length; i++){
            this.categorylisttoshow.push({Id: data[i].Id,Title: data[i].Title,Image: data[i].Image,ImageFile: data[i].ImageFile,
              Description: data[i].Description,
              DatePublished: data[i].DatePublished, Hidden: true})
          }
        }else{
          this.categorylisttoshow = data
        }
        this.showcategories = true
        this.GetBestSellerProducts()
        this.GetNewArrivalsProducts()
        this.GetOrganicProducts()
      }

    },
    error => { 
    });
  }


  GetProducts(){
    this.showproducts = false
    this.productService.getproducts("0","10").subscribe(data => {
      this.productlist = []    
      if(data != null && data != undefined && data.length != 0){
        if(data.length >= 5){
          var i
          for(i = 0; i < 4; i++){
            this.productlist.push({Id: data[i].Id,Title: data[i].Title,Image: data[i].Image,ImageFile: data[i].ImageFile,
              Description: data[i].Description, Price: data[i].Price.toFixed(2).toString(),
              DatePublished: data[i].DatePublished, Hidden: false})
          }
          for(i = 4; i < data.length; i++){
            this.productlist.push({Id: data[i].Id,Title: data[i].Title,Image: data[i].Image,ImageFile: data[i].ImageFile,
              Description: data[i].Description, Price: data[i].Price.toFixed(2).toString(),
              DatePublished: data[i].DatePublished, Hidden: true})
          }
        }else{
          this.productlist = data
        }
        this.productlist = this.productService.refreshProductList(this.productlist)
        this.showproducts = true
      }
    },
    error => { 
    });
  }


  GetProductsByCategory(category){
    this.showproducts = false
    this.productService.getproductoncategory(category).subscribe(data => {
      this.productlist = []    
      if(data != null && data != undefined && data.length != 0){
        if(data.length >= 5){
          var i
          for(i = 0; i < 4; i++){
            this.productlist.push({Id: data[i].Id,Title: data[i].Title,Image: data[i].Image,ImageFile: data[i].ImageFile,
              Description: data[i].Description, Price: data[i].Price.toFixed(2).toString(),
              DatePublished: data[i].DatePublished, Hidden: false})
          }
          for(i = 4; i < data.length; i++){
            this.productlist.push({Id: data[i].Id,Title: data[i].Title,Image: data[i].Image,ImageFile: data[i].ImageFile,
              Description: data[i].Description, Price: data[i].Price.toFixed(2).toString(),
              DatePublished: data[i].DatePublished, Hidden: true})
          }
        }else{
          this.productlist = data
        }
        this.productlist = this.productService.refreshProductList(this.productlist)
        this.showproducts = true
      }
    },
    error => { 
    });
  }

  GetBestSellerProducts(){
    this.showbestsellersproducts = false
    if(this.categorylist != undefined && this.categorylist != null){
      var tempcat = this.categorylist.find( x=> x.Title  == "Best Sellers")
      if(tempcat != null && tempcat != undefined && tempcat != ""){
        this.productService.getproductoncategory(tempcat).subscribe(data => {
          this.bestsellersproductlist = []     
          if(data != null && data != undefined && data.length != 0){
            if(data.length >= 5){
              var i
              for(i = 0; i < 4; i++){
                this.bestsellersproductlist.push({Id: data[i].Id,Title: data[i].Title,Image: data[i].Image,ImageFile: data[i].ImageFile,
                  Description: data[i].Description, Price: data[i].Price.toFixed(2).toString(),
                  DatePublished: data[i].DatePublished, Hidden: false})
              }
              for(i = 4; i < data.length; i++){
                this.bestsellersproductlist.push({Id: data[i].Id,Title: data[i].Title,Image: data[i].Image,ImageFile: data[i].ImageFile,
                  Description: data[i].Description, Price: data[i].Price.toFixed(2).toString(),
                  DatePublished: data[i].DatePublished, Hidden: true})
              }
            }else{
              this.bestsellersproductlist = data
            }
            this.bestsellersproductlist = this.productService.refreshProductList(this.bestsellersproductlist)
            this.showbestsellersproducts = true
          }
        },
        error => { 
        });
      }
    }
  }


  GetNewArrivalsProducts(){
    this.shownewarrivalsproducts = false
    if(this.categorylist != undefined && this.categorylist != null){
      var tempcat = this.categorylist.find( x=> x.Title  == "New Arrivals")
      if(tempcat != null && tempcat != undefined && tempcat != ""){
        this.productService.getproductoncategory(tempcat).subscribe(data => {
          this.newarrivalsproductlist = []     
          if(data != null && data != undefined && data.length != 0){
            if(data.length >= 5){
              var i
              for(i = 0; i < 4; i++){
                this.newarrivalsproductlist.push({Id: data[i].Id,Title: data[i].Title,Image: data[i].Image,ImageFile: data[i].ImageFile,
                  Description: data[i].Description, Price: data[i].Price.toFixed(2).toString(),
                  DatePublished: data[i].DatePublished, Hidden: false})
              }
              for(i = 4; i < data.length; i++){
                this.newarrivalsproductlist.push({Id: data[i].Id,Title: data[i].Title,Image: data[i].Image,ImageFile: data[i].ImageFile,
                  Description: data[i].Description, Price: data[i].Price.toFixed(2).toString(),
                  DatePublished: data[i].DatePublished, Hidden: true})
              }
            }else{
              this.newarrivalsproductlist = data
            }
            this.newarrivalsproductlist = this.productService.refreshProductList(this.newarrivalsproductlist)
            this.shownewarrivalsproducts = true
          }

        },
        error => { 
        });
      }
    }
  }


  GetOrganicProducts(){
    this.showorganicproducts = false
    if(this.categorylist != undefined && this.categorylist != null){
      var tempcat = this.categorylist.find( x=> x.Title  == "Organic Products")
      if(tempcat != null && tempcat != undefined && tempcat != ""){
        this.productService.getproductoncategory(tempcat).subscribe(data => {   
          if(data != null && data != undefined && data.length != 0){
            if(data.length >= 3){
              this.organicproduct1 = data[0].Image
              this.organicproduct2 = data[1].Image
              this.organicproduct3 = data[2].Image
            }
            this.showorganicproducts = true
          }
        },
        error => { 
        });
      }
    }
  }


  GetBanners(){
    this.bannerService.getbanners("0","5").subscribe(data => {
      this.bannerlist = data
      if(data != null && data != undefined && data.length != 0 && data != ""){
        this.activeBanner = data[0]
        this.bannerlist.splice(this.activeBanner, 1)
      }else{
        this.activeBanner.push({Image: "",Title:"",Description:""})
      }
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }
  //#endregion
  
  //#region calendar
  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked(event: any): void {
    // this.events.forEach(element => {
    //   if(event == element.start){

    //   }
    // });
    // //this.openAppointmentList(date)
  }
  //#endregion

  //#region categories
  AddCategory(){
    if(this.categorylisttoshow != null && this.categorylisttoshow != undefined && this.categorylisttoshow.length != 0){
      if(this.categorylisttoshow.length > 4){
        var i
        for(i = 0; i < this.categorylisttoshow.length; i++){
          if((this.categorylisttoshow[i].Hidden == false) && (i - 1) > -1){
            this.categorylisttoshow[i-1].Hidden = false
            this.categorylisttoshow[i+3].Hidden = true
            break
          }
        }
      }
    }
  }

  RemoveCategory(){
    if(this.categorylisttoshow != null && this.categorylisttoshow != undefined && this.categorylisttoshow.length != 0){
      if(this.categorylisttoshow.length > 4){
        var i
        for(i = 0; i < this.categorylisttoshow.length; i++){
          if((this.categorylisttoshow[i].Hidden == false) && (i + 4) < this.categorylisttoshow.length){
            this.categorylisttoshow[i].Hidden = true
            this.categorylisttoshow[i+4].Hidden = false
            break
          }
        }

      }
    }
  }
  //#endregion

  //#region best sellers products
  AddBestSellersProduct(){
    if(this.bestsellersproductlist != null && this.bestsellersproductlist != undefined && this.bestsellersproductlist.length != 0){
      if(this.bestsellersproductlist.length > 4){
        var i
        for(i = 0; i < this.bestsellersproductlist.length; i++){
          if((this.bestsellersproductlist[i].Hidden == false) && (i - 1) > -1){
            this.bestsellersproductlist[i-1].Hidden = false
            this.bestsellersproductlist[i+3].Hidden = true
            break
          }
        }
      }
    }
  }

  RemoveBestSellersProduct(){
    if(this.bestsellersproductlist != null && this.bestsellersproductlist != undefined && this.bestsellersproductlist.length != 0){
      if(this.bestsellersproductlist.length > 4){
        var i
        for(i = 0; i < this.bestsellersproductlist.length; i++){
          if((this.bestsellersproductlist[i].Hidden == false) && (i + 4) < this.bestsellersproductlist.length){
            this.bestsellersproductlist[i].Hidden = true
            this.bestsellersproductlist[i+4].Hidden = false
            break
          }
        }

      }
    }
  }
  //#endregion

  //#region best sellers products
  AddNewArrivalsProducts(){
    if(this.newarrivalsproductlist != null && this.newarrivalsproductlist != undefined && this.newarrivalsproductlist.length != 0){
      if(this.newarrivalsproductlist.length > 4){
        var i
        for(i = 0; i < this.newarrivalsproductlist.length; i++){
          if((this.newarrivalsproductlist[i].Hidden == false) && (i - 1) > -1){
            this.newarrivalsproductlist[i-1].Hidden = false
            this.newarrivalsproductlist[i+3].Hidden = true
            break
          }
        }
      }
    }
  }

  RemoveNewArrivalsProducts(){
    if(this.newarrivalsproductlist != null && this.newarrivalsproductlist != undefined && this.newarrivalsproductlist.length != 0){
      if(this.newarrivalsproductlist.length > 4){
        var i
        for(i = 0; i < this.newarrivalsproductlist.length; i++){
          if((this.newarrivalsproductlist[i].Hidden == false) && (i + 4) < this.newarrivalsproductlist.length){
            this.newarrivalsproductlist[i].Hidden = true
            this.newarrivalsproductlist[i+4].Hidden = false
            break
          }
        }

      }
    }
  }
  //#endregion

  //#region best sellers products
  AddProduct(){
    if(this.productlist != null && this.productlist != undefined && this.productlist.length != 0){
      if(this.productlist.length > 4){
        var i
        for(i = 0; i < this.productlist.length; i++){
          if((this.productlist[i].Hidden == false) && (i - 1) > -1){
            this.productlist[i-1].Hidden = false
            this.productlist[i+3].Hidden = true
            break
          }
        }
      }
    }
  }

  RemoveProduct(){
    if(this.productlist != null && this.productlist != undefined && this.productlist.length != 0){
      if(this.productlist.length > 4){
        var i
        for(i = 0; i < this.productlist.length; i++){
          if((this.productlist[i].Hidden == false) && (i + 4) < this.productlist.length){
            this.productlist[i].Hidden = true
            this.productlist[i+4].Hidden = false
            break
          }
        }

      }
    }
  }
  //#endregion

  //#region add-remove from cart
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
  //#endregion
}
