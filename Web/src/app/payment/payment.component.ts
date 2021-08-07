import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Credentials } from '../models/credentials.model';
import { AlertService } from '../alert/alert.service';
import { SystemUser } from '../models/systemuser.model';
import { UserService } from '../admin/dashboard/user.service';
import { LocalStorage } from '../util/localstorage.service';
import { Payment } from '../models/payment.model';
import { isNumber } from 'util';
import { PaymentService } from './payment.service';
import * as AOS from 'aos';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  public user: SystemUser;
  public productid: string = "";
  public productname: string = "";
  public cardno: string = "";
	public nameoncard: string = "";
  public price: string = "0";
  public expmonth: string = "0";
  public expyear: string = "0";
  public cvv: string = "0";
	public payment: Payment;
  public savebtnactive: boolean = true
  public paymentsuccess: boolean = false
  public cardtype: string = "";

	constructor(private router: Router,private paymentService: PaymentService,
		private alertService: AlertService, private userService: UserService,) {
	}

	ngOnInit() {
    AOS.init();
    localStorage.setItem(LocalStorage.LANDING_BODY, "0");
    this.price = localStorage.getItem(LocalStorage.PRODUCT_PRICE)
    this.productid = localStorage.getItem(LocalStorage.PRODUCT_ID)
    this.productname = localStorage.getItem(LocalStorage.PRODUCT_NAME)
    this.user = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER)) as SystemUser; 
    if(this.user == null || this.user == "" || this.user == undefined){
      this.router.navigateByUrl('/login')
    }
	}

  Validations(){
    this.alertService.clear()
    if(this.price == null || this.price == undefined || this.price == ""){
      this.alertService.error('Price is required')
      return false
    }

    if(this.nameoncard == null || this.nameoncard == undefined || this.nameoncard == ""){
      this.alertService.error('Name is required')
      return false
    }

    if(this.cardno == null || this.cardno == undefined || this.cardno == ""){
      this.alertService.error('Invalid card number')
      return false
    }

    if(this.expmonth == null || this.expmonth == undefined || this.expmonth == "" || isNumber(this.expmonth)){
      this.alertService.error('Invalid month of expiry')
      return false
    }

    if(this.expyear == null || this.expyear == undefined || this.expyear == "" || isNumber(this.expyear)){
      this.alertService.error('Invalid year of expiry')
      return false
    }

    if(this.cvv == null || this.cvv == undefined || this.cvv == ""){
      this.alertService.error('Invalid CVV')
      return false
    }

    return true
  }

	CheckoutBtnClickEvent(){
    this.alertService.clear()
    this.savebtnactive = false
    this.paymentsuccess = false

		localStorage.clear();
		if(this.Validations()){
      this.payment = new Payment();
      this.payment.UserId = this.user.Id
      this.payment.TutorialId = this.productid
      this.payment.TutorialName = this.productname
      this.payment.Price = parseFloat(this.price)
      this.payment.CardNumber = this.cardno
			this.payment.NameOnCard = this.nameoncard
      this.payment.ExpMonth = parseInt(this.expmonth)
      this.payment.ExpYear = parseInt(this.expyear)
      this.payment.CVV = this.cvv

      const paymentdetails: FormData = new FormData();
      paymentdetails.append("payment", JSON.stringify(this.payment));
      paymentdetails.append("user", JSON.stringify(this.user));

			this.alertService.info('Please wait..')
			this.paymentService.payment(paymentdetails).subscribe(data => {
        this.alertService.clear()
        this.savebtnactive = true
        if(data == "succeeded"){
          this.alertService.success('Payment successful!')
          this.paymentsuccess = true
        }else{
          this.alertService.error('Payment declined!')
        }
        
			},
			error => { 
				this.alertService.clear()
        this.alertService.error('Error!')
        this.savebtnactive = true
			});
    }else{
      this.savebtnactive = true
    }
  } 

  GetCardType()
  {
    let number = this.cardno
    //Visa
    var re = new RegExp("^4");
    if (number.match(re) != null)
      this.cardtype = "Visa";

    // Mastercard 
    if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)) 
     this.cardtype = "Mastercard";

    // AMEX
    re = new RegExp("^3[47]");
    if (number.match(re) != null)
      this.cardtype = "AMEX";

    // Discover
    re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (number.match(re) != null)
      this.cardtype = "Discover";

    // Diners
    re = new RegExp("^36");
    if (number.match(re) != null)
      this.cardtype = "Diners";

    // Diners - Carte Blanche
    re = new RegExp("^30[0-5]");
    if (number.match(re) != null)
      this.cardtype = "Diners - Carte Blanche";

    // JCB
    re = new RegExp("^35(2[89]|[3-8][0-9])");
    if (number.match(re) != null)
      this.cardtype = "JCB";

    // Visa Electron
    re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
    if (number.match(re) != null)
      this.cardtype = "Visa Electron";
  }

  FormatCreditCard() {
    this.cardno = this.cardno.replace(/\D/g, "")
    if(this.cardno != null && this.cardno != undefined && this.cardno != ""){
      let temp = this.cardno.split('-').join('');
      this.cardno = temp.match(/.{1,4}/g).join('-');
      this.GetCardType()
    }
  }

  FormatMonth() {
    this.expmonth = this.expmonth.replace(/\D/g, "")
  }

  FormatYear() {
    this.expyear = this.expyear.replace(/\D/g, "")
  }

  FormatCVV() {
    this.cvv = this.cvv.replace(/\D/g, "")
  }
}

