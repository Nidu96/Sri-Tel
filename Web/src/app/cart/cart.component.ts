import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { LocalStorage } from '../util/localstorage.service';
import { ProductService } from '../admin/product/product.service';
import { AlertService } from '../alert/alert.service';
// import { JsonPipe } from '@angular/common';
// import hmacSHA256 from 'crypto-js/hmac-sha512';
// import Base64 from 'crypto-js/enc-base64';
import * as CryptoJS from 'crypto-js';
import { Product } from '../models/product.model';
import { debug } from 'util';
import { Order, OrderedProduct } from '../models/order.model';
import { OrderService } from '../admin/order/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public order: Order;
  public selectedProducts: Array<Product>;
  public emptyCart: boolean = true;
  public showDirectPay: boolean = false;
  public orderid: string;
  public name: string;
  public recname: string;
  public recphone: string;
  public phone: string;
  public address: string;
  public notes: string;
  public city: string;
  public quantity: number;
  public totalprice: number = 0;
  public signature: any;
  public dataString: any;
  public paymentRequest: any;

  constructor(private productService: ProductService,private alertService: AlertService,private orderService: OrderService) { }

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
      var price = 0
      this.selectedProducts.forEach(e => {
        price += (parseInt(e.Price) * e.Quantity)
        this.totalprice = price
      });
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

  //#region "validations"
  Validations(){
    this.alertService.clear()
    if(this.name == null || this.name == undefined || this.name == ""){
      this.alertService.error('Name is required')
      return false
    }

    if(this.recname == null || this.recname == undefined || this.recname == ""){
      this.alertService.error("Recipient's Name is required")
      return false
    }

    if(this.phone == null || this.phone == undefined || this.phone == ""){
      this.alertService.error('Phone is required')
      return false
    }

    if(this.recphone == null || this.recphone == undefined || this.recphone == ""){
      this.alertService.error("Recipient's phone is required")
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

  validateNumbers(){
    var regex = /^[0-9]*$/
    if(!regex.test(this.phone)){
      this.phone = ""
    }
    if(!regex.test(this.recphone)){
      this.recphone = ""
    }
  }

  validateQuantity(event,id){
    this.quantity = event.target.value
    var regex = /^[0-9]*$/
    if(!regex.test(this.quantity.toString())){
      this.quantity = 0
      return
    }else{
      this.selectedProducts.find( x=> x.Id  == id).Quantity = parseInt(this.quantity.toString())
      localStorage.setItem(LocalStorage.SHOPPING_CART, JSON.stringify(this.selectedProducts));
      var price = 0
      this.selectedProducts.forEach(element => {
        price += (parseInt(element.Price) * element.Quantity)
        this.totalprice = price
      });
    }
  }
//#region 

  ContinueToPayment(){
    if(this.Validations()){
      let email = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER)).Username;
      if(this.selectedProducts != null && this.selectedProducts != undefined && this.selectedProducts.length != 0){
        let description = ""
        this.orderid = (Math.floor(Math.random() * 999) + 1).toString()
        description = "Order ID: " + this.orderid.toString() +"    "
        this.selectedProducts.forEach(element => {
          description = description + 
          "Product Name: " + element.Title + " "
          "Unit Price: " + element.Price + " "
          "Quantity: " + element.Quantity + " "
        });
        description = description + "   Total Price: " + this.totalprice
        var json = {
          "merchant_id": "AA08654",
          "amount": this.totalprice,
          "type": 'ONE_TIME',
          "order_id": this.orderid.toString(),
          "currency": "LKR",
          "return_url": "",
          "response_url": "",
          "first_name": this.name,
          "last_name": "",
          "phone": this.phone,
          "email": email,
          "description": description,
          "page_type": 'IN_APP',
        }
        this.dataString =  CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(json)));
        this.signature = CryptoJS.HmacSHA256(this.dataString, "4b6ceb2bfb9b113598e43e35b4bf1bcb2912b99f0d1821a4176ab39f4660310f");
      
        this.paymentRequest = {
          signature: this.signature,
          dataString: this.dataString,
          stage: 'DEV'
        };
        this.showDirectPay = true
      }
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

//#region "order"
  saveOrder(){
    this.order = new Order();
    this.order.Id = "";
    this.order.IdForCustomer = this.orderid;
    this.order.UserEmail = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER)).Username;
    this.order.Phone = this.phone;
    this.order.RecepientName = this.recname;
    this.order.RecepientPhone = this.recphone;
    this.order.Status = "Pending";
    this.order.DeliveryNote = this.notes;
    this.order.City = this.city;
    this.order.DateofPayment = new Date();
    let OrderedProducts = new Array<OrderedProduct>()
    this.selectedProducts.forEach(element => {
      let orderedproduct = new OrderedProduct()
      orderedproduct.Id = ""
      orderedproduct.OrderId = this.orderid
      orderedproduct.ProductID = element.Id
      orderedproduct.Quantity = element.Quantity.toString()
      OrderedProducts.push(orderedproduct)
    });

    this.order.OrderedProducts = []
    this.order.OrderedProducts = OrderedProducts
    this.orderService.saveorder(this.order).subscribe(data => {
    },
    error => {
      this.alertService.clear() 
      this.alertService.error('Error!')
    });
  }
//#endregion
}
