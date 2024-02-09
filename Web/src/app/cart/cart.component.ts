import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { LocalStorage } from '../util/localstorage.service';
import { AlertService } from '../alert/alert.service';
// import { JsonPipe } from '@angular/common';
// import hmacSHA256 from 'crypto-js/hmac-sha512';
// import Base64 from 'crypto-js/enc-base64';
import * as CryptoJS from 'crypto-js';
import { debug } from 'util';
import { SystemUser } from '../models/systemuser.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  public loggedInUser: SystemUser;
  public emptyCart: boolean = true;
  public showDirectPay: boolean = false;
  public delivery: string;
  public orderid: string;
  public name: string;
  public recname: string;
  public recphone: string;
  public phone: string;
  public email: string;
  public address: string;
  public notes: string;
  public city: string;
  public quantity: number;
  public totalprice: number = 0;
  public subtotal: number = 0;
  public deliveryfee: number = 190;
  public totalweight: number = 0;
  public noofitems: number = 0;
  public signature: any;
  public dataString: any;
  public paymentRequest: any;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    AOS.init();
    this.loggedInUser = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER)) as SystemUser;
    let temp = localStorage.getItem(LocalStorage.SHOPPING_CART)
  }

//#region "validations"
  Validations(){
    this.alertService.clear()
    if(this.name == null || this.name == undefined || this.name == ""){
      this.alertService.error('Name is required')
      return false
    }

    // if(this.recname == null || this.recname == undefined || this.recname == ""){
    //   this.alertService.error("Recipient's Name is required")
    //   return false
    // }

    if(this.phone == null || this.phone == undefined || this.phone == ""){
      this.alertService.error('Phone is required')
      return false
    }

    if(this.email == null || this.email == undefined || this.email == ""){
      this.alertService.error('Email is required')
      return false
    }
    // if(this.recphone == null || this.recphone == undefined || this.recphone == ""){
    //   this.alertService.error("Recipient's phone is required")
    //   return false
    // }
    if(this.delivery == undefined || this.delivery == "" || this.delivery == null){
      this.alertService.error('please select store pickup or delivery')
      return false
    }

    if((this.address == undefined || this.address == "" || this.address == null) && this.delivery == "1"){
      this.alertService.error('Delivery address is required')
      return false
    }

    if((this.city == undefined || this.city == "" || this.city == null) && this.delivery == "1"){
      this.alertService.error('Delivery city is required')
      return false
    }
    return true
  }

  validateNumbers(){
    var regex = /^[0-9]*$/
    if(!regex.test(this.phone)){
      this.phone = ""
    }
    if(!regex.test(this.recphone)){
      this.recphone = ""
    }
  }


  isDelivery(val){
    this.delivery = val.toString()
  }
//#endregion 

//#region "Payment"
  ContinueToPayment(){
    if(this.Validations()){
    }
    
  }


  public onSuccess(param: any): void {
    console.log('client-onSuccess',param);
    this.saveOrder()
    alert(JSON.stringify(param))
  }

  public onError(param: any): void {
    console.log('client-onError',param);
    alert(JSON.stringify(param))
  }
//#endregion

//#region "order"

  saveOrder(){
    if(this.Validations()){

    }
  }
//#endregion
}
