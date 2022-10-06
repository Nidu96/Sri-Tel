import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {NgbDate, NgbModal, ModalDismissReasons, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { BsModalService,BsModalRef}   from 'ngx-bootstrap/modal';
import { SystemUser } from 'src/app/models/systemuser.model';
import { AlertService } from 'src/app/alert/alert.service';
import { OrderService } from './order.service';
import { DatepickerServiceInputs } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-service';
import { Product } from 'src/app/models/product.model';
import { LocalStorage } from 'src/app/util/localstorage.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Order, OrderedProduct } from 'src/app/models/order.model';
 
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  public closeResult = '';
  public ModalRef : BsModalRef;
  public order: Order;
  public porders: number = 1;
  public ordercount: number = 0;

  //form fields
  public id: string;
  public idforcustomer: string;
  public useremail: string;
  public deliverynote: string;
  public phone: string;
  public recepientname: string;
  public recepientphone: string;
  public status: string;
  public delivery: string;
  public dateofpayment: Date;
  public city: string;
  public totalamount: Number;
  
  public orderlist: Array<Order> = []
  public orderproductlist: Array<OrderedProduct> = []
  public savebtn: boolean = true
  public savebtnactive: boolean = true

  @ViewChild('showorder', {static: false}) showorder: TemplateRef<any>
  
  constructor(private bsModalService :BsModalService, private orderService: OrderService,
    private parserFormatter: NgbDateParserFormatter, private alertService: AlertService,private imageCompress: NgxImageCompressService) { }

  ngOnInit() {
    this.orderlist = []
    this.orderproductlist = []
    this.GetOrders(0)
    localStorage.setItem(LocalStorage.LANDING_BODY, "0");
  }

  Initialize(){
    this.id = "";
    this.idforcustomer = "";
    this.useremail = "";
    this.deliverynote = "";
    this.phone = "";
    this.recepientname = "";
    this.recepientphone = "";
    this.status = "";
    this.delivery = "";
    this.dateofpayment = new Date();
    this.city = "";
    this.totalamount = 0;
    this.savebtnactive = true
  }

  SaveOrder(){
    this.alertService.clear()
    this.savebtnactive = false

    if(this.Validations()){
      this.order = new Order();

      if(this.id != null && this.id != undefined && this.id != ""){
        this.order.Id = this.id.trim();
      }
      this.order.Status = this.status;

      this.orderService.saveorder(this.order).subscribe(data => {
        this.alertService.success('Successfully saved!')
        this.CloseModal()
        this.orderlist = []
        this.GetOrders(0)
        this.Initialize()

        
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


  Validations(){
    this.alertService.clear()
    if(this.status == null || this.status == undefined || this.status == ""){
      this.alertService.error('Status is required')
      return false
    }
    return true
  }

  CloseModal(){
    this.ModalRef.hide();
    this.Initialize()
  }

  GetOrders(startlimit){
    this.orderService.getorders(startlimit.toString(),"10").subscribe(data => {
      data.forEach(element => {
        var i = this.orderlist.findIndex(x=> x.Id  === element.Id)
        if(this.orderlist.findIndex(x=> x.Id  === element.Id) == -1){
          this.orderlist.push(element)
        }
      });
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }

  ViewOrder(id: string){
    this.alertService.clear()
    this.order = new Order();
    this.order.Id = id
    this.orderService.getorderdata(this.order).subscribe(data => {
      this.order = data[0]

      this.id = data[0].Id;
      this.idforcustomer = data[0].IdForCustomer;
      this.useremail = data[0].UserEmail;
      this.deliverynote = data[0].DeliveryNote;
      this.phone = data[0].Phone;
      this.recepientname = data[0].RecepientName;
      this.recepientphone = data[0].RecepientPhone;
      this.status = data[0].Status;
      if(data[0].Delivery == true){
        this.delivery = "Delivery";
      }else{
        this.delivery = "Store Pickup";
      }
      this.dateofpayment = new Date(data[0].DateofPayment);
      this.city = data[0].City;
      if(data[0].TotalAmount != null){
        this.totalamount = data[0].TotalAmount.toFixed(2).toString();
      }
      
      this.orderproductlist = data[0].OrderedProducts;
      this.ModalRef = this.bsModalService.show(this.showorder)
      this.savebtn = false
    },
    error => {
      this.alertService.clear() 
      this.alertService.error('Error!')
    });
  }

  EditOrder(id: string){
    this.alertService.clear()
    this.order = new Order();
    this.order.Id = id
    this.orderService.getorderdata(this.order).subscribe(data => {
      this.order = data[0]

      this.id = data[0].Id;
      this.idforcustomer = data[0].IdForCustomer;
      this.useremail = data[0].UserEmail;
      this.deliverynote = data[0].DeliveryNote;
      this.phone = data[0].Phone;
      this.recepientname = data[0].RecepientName;
      this.recepientphone = data[0].RecepientPhone;
      this.status = data[0].Status;
      if(data[0].Delivery == true){
        this.delivery = "Delivery";
      }else{
        this.delivery = "Store Pickup";
      }
      this.dateofpayment = new Date(data[0].DateofPayment);
      this.city = data[0].City;
      if(data[0].TotalAmount != null){
        this.totalamount = data[0].TotalAmount.toFixed(2).toString();
      }
      
      this.orderproductlist = data[0].OrderedProducts;
      this.ModalRef = this.bsModalService.show(this.showorder)
      this.savebtn = true
    },
    error => {
      this.alertService.clear() 
      this.alertService.error('Error!')
    });
  }

  DeleteOrder(id: string){
    if(confirm("Are you sure you want to delete this product?")){
      this.alertService.clear()
      this.order = new Order();
      this.order.Id = id
      this.orderService.deleteorder(this.order).subscribe(data => {
        this.alertService.success('Successfully deleted!')
        this.orderlist = []
        this.GetOrders(0)
      },
      error => {
        this.alertService.clear() 
        this.alertService.error('Error!')
      });
    }
  }

  pagination(event){
    if(this.ordercount < event){
      var tempcount = Math.abs(event-1.5) * 10
      if(event == 1) tempcount = 0
      this.GetOrders(tempcount) 
    } 
    this.porders = event
    this.ordercount = event
  }
}

