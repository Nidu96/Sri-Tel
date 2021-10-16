import { Component, OnInit } from '@angular/core';
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
export class LandingComponent implements OnInit {

  public categorylist: Array<Category> = []
  public categorylisttoshow: Array<any> = []
  public categorylisttohidden: Array<Category> = []
  public showcategories: boolean = false;

  public productlist: Array<any> = []
  public showproducts: boolean = false;

  public bannerlist: Array<any> = []
  public activeBanner: any;

  public viewDate: Date = new Date();
  public view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  public events: Array<CalendarEvent>

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
    this.categoryService.getcategories().subscribe(data => {
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
      }

    },
    error => { 
    });
  }


  GetProducts(){
    this.showproducts = false
    this.productService.getproducts().subscribe(data => {
      this.productlist = []     
      if(data != null && data != undefined && data.length != 0){
        if(data.length >= 6){
          this.productlist.push(
            data[0],
            data[1],
            data[2],
            data[3],
            data[4],
            data[5])
        }else{
          this.productlist = data
        }
        this.showproducts = true
      }

    },
    error => { 
    });
  }


  GetBanners(){
    this.bannerService.getbanners().subscribe(data => {
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
}
