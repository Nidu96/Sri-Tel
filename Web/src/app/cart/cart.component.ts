import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { LocalStorage } from '../util/localstorage.service';
import { ProductService } from '../admin/product/product.service';
import { AlertService } from '../alert/alert.service';
// import { JsonPipe } from '@angular/common';
// import hmacSHA256 from 'crypto-js/hmac-sha512';
// import Base64 from 'crypto-js/enc-base64';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public selectedProducts: Array<any>;
  public emptyCart: boolean = true;
  public name: string;
  public phone: string;
  public address: string;
  public notes: string;
  public city: string;
  public signature: any;
  public dataString: any;
  public paymentRequest: any;

  constructor(private productService: ProductService,private alertService: AlertService) { }

  ngOnInit() {
    AOS.init();

    let temp = localStorage.getItem(LocalStorage.SHOPPING_CART)
    this.selectedProducts = [];
    if(temp != undefined && temp != null && temp != ""){
      this.selectedProducts = JSON.parse(localStorage.getItem(LocalStorage.SHOPPING_CART));
    }

    if(this.selectedProducts == null || this.selectedProducts == undefined || this.selectedProducts.length == 0){
      this.emptyCart = true;
    }else{
      this.emptyCart = false;
    }
  }

  removeFromCartBtnClick(item: any){
    this.selectedProducts = []
    let temp = localStorage.getItem(LocalStorage.SHOPPING_CART)
    if(temp != undefined && temp != null && temp != ""){
      this.selectedProducts = JSON.parse(localStorage.getItem(LocalStorage.SHOPPING_CART));
    }
    if(this.selectedProducts != null && this.selectedProducts != undefined && this.selectedProducts.length != 0){
      this.selectedProducts.splice(item, 1)
    }
    localStorage.setItem(LocalStorage.SHOPPING_CART, JSON.stringify(this.selectedProducts));
    this.productService.refreshshoppingcart();
    if(this.selectedProducts == null || this.selectedProducts == undefined || this.selectedProducts.length == 0){
      this.emptyCart = true;
    }
    // this.router.navigateByUrl('/payment')
  }

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

    if(this.address == undefined || this.address == "" || this.address == null){
      this.alertService.error('Delivery address is required')
      return false
    }

    if(this.city == undefined || this.city == "" || this.city == null){
      this.alertService.error('Delivery city is required')
      return false
    }
    return true
  }

  ContinueToPayment(){
    var json = {
      "merchant_id": "AA08654",
      "amount": "5",
      "type": 'ONE_TIME',
      "order_id":  Math.floor(Math.random() * 999) + 1,
      "currency": "LKR",
      "return_url": "",
      "response_url": "http://localhost:4200",
      "first_name": "john",
      "last_name": "doe",
      "phone": "0757966404",
      "email": "sihaninidu3@mail.com",
      "description": 'Test Product',
      "page_type": 'IN_APP',
    }
    this.dataString =  CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(json)));
    this.signature = CryptoJS.HmacSHA256(this.dataString, "4b6ceb2bfb9b113598e43e35b4bf1bcb2912b99f0d1821a4176ab39f4660310f");
  
    this.paymentRequest = {
      signature: this.signature,
      dataString: this.dataString,
      stage: 'DEV'
    };

    // this.productService.pay(directpay).subscribe(data => {
    //   this.alertService.success('Successfully saved!')
    // },
    // error => {
    //   this.alertService.clear()
    //   this.alertService.error('Error!')
    // });

  }


  // paymentRequest = {
  //     signature: 'rV0raXUIt+lFhxrUUGW98UipaJNaRw7uWq23/wHbYMQMQ56lbuQDdSGPlHos6jY0hC8jcMXfcH4SH87qeo0Bqw==',
  //     dataString: {
  //       merchantId: 'AA08654',
  //       amount: "10.00",
  //       refCode: "DP12345",
  //       currency: 'LKR',
  //       type: 'ONE_TIME_PAYMENT',
  //       customerEmail: 'sihaninidu3@mail.com',
  //       customerMobile: '+94757966404',
  //       description: 'test products',
  //       apiKey: 'b43d69f3e70b2b3b5e765bf17b8b9553025d15dfe69ea7e9818da2df59ea3405'
  //     },
  //     stage: 'DEV'
  // };

  public onSuccess(param: any): void {
    debugger
    console.log('client-onSuccess',param);
    alert(JSON.stringify(param))
  }

  public onError(param: any): void {
    debugger
    console.log('client-onError',param);
    alert(JSON.stringify(param))
  }
}
