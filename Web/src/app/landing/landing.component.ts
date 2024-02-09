import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as AOS from 'aos';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { LocalStorage } from '../util/localstorage.service';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { BannerService } from '../admin/banner/banner.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
@HostListener('window:scroll', ['$event'])
export class LandingComponent implements OnInit {

  public bannerlist: Array<any> = []
  public activeBanner: any;

  public viewDate: Date = new Date();
  public view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  public events: Array<CalendarEvent>

  public counter1: number

  constructor(private router: Router,
     private alertService: AlertService,
    private bannerService: BannerService,) { }

  ngOnInit() {
    this.activeBanner = ""
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
