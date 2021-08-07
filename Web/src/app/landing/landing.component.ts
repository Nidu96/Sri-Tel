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

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  public categorylist: Array<Category> = []
  public showcategories: boolean = false;

  public productlist: Array<any> = []
  public showproducts: boolean = false;

  public viewDate: Date = new Date();
  public view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  public events: Array<CalendarEvent>

  constructor(private router: Router,private categoryService: CategoryService, private productService: ProductService, private alertService: AlertService) { }

  ngOnInit() {
    AOS.init();
    this.GetCategories();
    this.GetProducts();
    localStorage.setItem(LocalStorage.LANDING_BODY, "1");
  }

  //#region navigation methods
  ShowEvents(){
    this.router.navigateByUrl('events')
  }

  ShowPosts(){
    this.router.navigateByUrl('products')
  }

  ShowTutorials(){
    this.router.navigateByUrl('tutorials')
  }

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
      this.categorylist = []     
      if(data != null && data != undefined && data.length != 0){
        if(data.length >= 6){
          this.categorylist.push(
            data[0],
            data[1],
            data[2],
            data[3],
            data[4],
            data[5])
        }else{
          this.categorylist = data
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
}
