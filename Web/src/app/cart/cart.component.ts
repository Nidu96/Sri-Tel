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
      this.calculations()
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
    }else{
      this.calculations()
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
      var weight = 0
      this.selectedProducts.forEach(element => {
        price += (parseFloat(element.Price) * element.Quantity)
        this.subtotal = Number(price.toFixed(2))
        this.totalprice = Number(price.toFixed(2))
        weight += parseInt(element.Weight)
        this.totalweight = weight
      });
    }
  }

  calculations(){
    var price = 0
    var weight = 0
    this.selectedProducts.forEach(e => {
      e.Price = parseFloat(e.Price).toFixed(2).toString()
      e.TotalPrice = parseFloat(e.TotalPrice).toFixed(2).toString()
      price += (parseFloat(e.Price) * e.Quantity)
      this.subtotal = Number(price.toFixed(2))
      this.totalprice = Number(price.toFixed(2))
      weight += parseInt(e.TotalWeight)
      this.totalweight = weight
    });
    this.noofitems = this.selectedProducts.length
    if(this.totalweight > 1000){
      var cal = ((parseInt((this.totalweight - 1000).toString())/1000)*45) + 190
      this.deliveryfee = cal
      this.totalprice += this.deliveryfee
    } else{
      this.deliveryfee = 190
      this.totalprice += this.deliveryfee
    }
  }

  isDelivery(val){
    this.delivery = val.toString()
  }
//#endregion 

//#region "Payment"
  ContinueToPayment(){
    if(this.Validations()){
      // let email = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER)).Username;
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
        description = description + "   Subtotal: " + this.subtotal
        description = description + "   Delivery Fee: " + this.deliveryfee
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
          "email": this.email,
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
//#endregion

//#region "order"
  plusClick(id){
    this.selectedProducts.find( x=> x.Id  == id).Quantity += 1
    var pricecal = this.selectedProducts.find( x=> x.Id  == id).Quantity * parseInt(this.selectedProducts.find( x=> x.Id  == id).Price)
    var weightcal = this.selectedProducts.find( x=> x.Id  == id).Quantity * parseInt(this.selectedProducts.find( x=> x.Id  == id).Weight)
    this.selectedProducts.find( x=> x.Id  == id).TotalPrice = pricecal.toString()
    this.selectedProducts.find( x=> x.Id  == id).TotalWeight = weightcal.toString()
    this.calculations()
    localStorage.setItem(LocalStorage.SHOPPING_CART, JSON.stringify(this.selectedProducts));
  }

  minusClick(id){
    if(this.selectedProducts.find( x=> x.Id  == id).Quantity > 1){
      this.selectedProducts.find( x=> x.Id  == id).Quantity -= 1
      var pricecal = this.selectedProducts.find( x=> x.Id  == id).Quantity * parseInt(this.selectedProducts.find( x=> x.Id  == id).Price)
      var weightcal = this.selectedProducts.find( x=> x.Id  == id).Quantity * parseInt(this.selectedProducts.find( x=> x.Id  == id).Weight)
      this.selectedProducts.find( x=> x.Id  == id).TotalPrice = pricecal.toString()
      this.selectedProducts.find( x=> x.Id  == id).TotalWeight = weightcal.toString()
      this.calculations()
      localStorage.setItem(LocalStorage.SHOPPING_CART, JSON.stringify(this.selectedProducts));
    }
  }

  saveOrder(){
    if(this.Validations()){
      this.order = new Order();
      this.order.Id = "";
      if(this.orderid == null || this.orderid == undefined || this.orderid == ""){
        this.orderid = (Math.floor(Math.random() * 999) + 1).toString()
      }
      this.order.IdForCustomer = this.orderid;
      this.order.UserEmail = this.email;
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
        if(this.delivery == "0"){
          this.alertService.success('Order submitted Successfully!')
        }
      },
      error => {
        this.alertService.clear() 
        this.alertService.error('Error!')
      });
    }
  }
//#endregion
}
