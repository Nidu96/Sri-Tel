import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { LocalStorage } from '../util/localstorage.service';
import { AlertService } from '../alert/alert.service';
import * as CryptoJS from 'crypto-js';
import { debug } from 'util';
import { SystemUser } from '../models/systemuser.model';
import { Router } from '@angular/router';
import { PaymentService } from '../payment/payment.service';
import { Bill } from '../models/payment.model';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {
  public loggedInUser: SystemUser;
  public name: string;
  public phone: string;
  public email: string;
  public roaming: boolean = false;
  public ringingtone: boolean = false;
  public package: boolean = false;
  public roamingprice: number = 0;
  public ringingtoneprice: number = 0;
  public packageprice: number = 0;
  public totalprice: number = 0;
  public billslist: Array<Bill> = []

  constructor(private alertService: AlertService,private router: Router,private paymentService: PaymentService) { }

  ngOnInit() {
    AOS.init();
    this.loggedInUser = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER)) as SystemUser;
    this.GetBills();

    this.name = this.loggedInUser.Name;
    this.email = this.loggedInUser.Username;
    this.phone = this.loggedInUser.Phone;
    if(this.loggedInUser.Roaming == "Active"){
      this.roamingprice = 1200
      this.roaming = true;
    }
    if(this.loggedInUser.RingingTone == "Active"){
      this.ringingtoneprice = 200
      this.ringingtone = true;
    }
    if(this.loggedInUser.WorkPackage == "Active"){
      this.packageprice = 1850
      this.package = true;
    }
    if(this.loggedInUser.StudentPackage == "Active"){
      this.packageprice = 550
      this.package = true;
    }
    if(this.loggedInUser.WorkStudentPackage == "Active"){
      this.packageprice = 1500
      this.package = true;
    }
    if(this.loggedInUser.FamilyPackage == "Active"){
      this.packageprice = 2300
      this.package = true;
    }
    if(this.loggedInUser.FamilyPlusPackage == "Active"){
      this.packageprice = 3200
      this.package = true;
    }
    this.totalprice = this.roamingprice + this.ringingtoneprice + this.packageprice;
    localStorage.setItem(LocalStorage.TOTAL_PRICE, this.totalprice.toString());
  }

//#region "validations"
  Validations(){
    this.alertService.clear()
    if(this.name == null || this.name == undefined || this.name == ""){
      this.alertService.error('Name is required')
      return false
    }

    if(this.phone == null || this.phone == undefined || this.phone == ""){
      this.alertService.error('Phone is required')
      return false
    }

    if(this.email == null || this.email == undefined || this.email == ""){
      this.alertService.error('Email is required')
      return false
    }
    return true
  }

  validateNumbers(){
    var regex = /^[0-9]*$/
    if(!regex.test(this.phone)){
      this.phone = ""
    }
  }

//#endregion 

//#region "Payment"
  ContinueToPayment(){
    if(this.Validations()){
      this.router.navigate(['/payment']);
    }
  }

  public onSuccess(param: any): void {
    console.log('client-onSuccess',param);
    alert(JSON.stringify(param))
  }

  public onError(param: any): void {
    console.log('client-onError',param);
    alert(JSON.stringify(param))
  }
//#endregion

//#region "get bills"

GetBills(){
  this.paymentService.getbills(this.loggedInUser.Id, this.loggedInUser).subscribe(data => {
    data.forEach(element => {
      this.billslist.push(element)
    });
  },
  error => { 
    this.alertService.clear()
    this.alertService.error('Error!')
  });
}
//#endregion
}
