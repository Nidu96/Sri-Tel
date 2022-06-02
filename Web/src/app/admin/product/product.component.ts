import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {NgbDate, NgbModal, ModalDismissReasons, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { BsModalService,BsModalRef}   from 'ngx-bootstrap/modal';
import { SystemUser } from 'src/app/models/systemuser.model';
import { AlertService } from 'src/app/alert/alert.service';
import { ProductService } from './product.service';
import { DatepickerServiceInputs } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-service';
import { Product } from 'src/app/models/product.model';
import { LocalStorage } from 'src/app/util/localstorage.service';
import { CategoryService } from '../category/category.service';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  public closeResult = '';
  public ModalRef : BsModalRef;
  public product: Product;
  public pproducts: number = 1;
  public productcount: number = 0;

  //form fields
  public id: string;
  public title: string;
  public description: string;
  public datepublished: Date;
  public price: string;
  public weight: number;
  public category: string;
  public categoryid: string;
  public fileToUpload;
  public image;
  public showImage: boolean = false;
  public valueChanged: boolean = false;
  public productlist: Array<Product> = []
  public categorylist: Array<Product> = []
  public savebtn: boolean = true
  public savebtnactive: boolean = true

  @ViewChild('createnewproduct', {static: false}) createnewproduct: TemplateRef<any>
  
  constructor(private bsModalService :BsModalService, private productService: ProductService, private categoryService: CategoryService,
    private parserFormatter: NgbDateParserFormatter, private alertService: AlertService,private imageCompress: NgxImageCompressService) { }

  ngOnInit() {
    this.productlist = []
    this.GetProducts(0)
    this.GetCategories()
    localStorage.setItem(LocalStorage.LANDING_BODY, "0");
  }

  Initialize(){
    this.id = "";
    this.title = "";
    this.price = "";
    this.weight = 0;
    this.description = "";
    this.category = "";
    this.categoryid = "";
    this.image = "";
    this.showImage = false;
    this.datepublished = new Date();
    this.savebtnactive = true
  }

  CreateProduct() {
    this.ModalRef = this.bsModalService.show(this.createnewproduct)
    this.savebtn = true
    this.savebtnactive = true
    this.Initialize()
  }

  SaveProduct(){
    this.alertService.clear()
    this.savebtnactive = false

    if(this.Validations()){
      this.product = new Product();

      if(this.id != null && this.id != undefined && this.id != ""){
        this.product.Id = this.id.trim();
      }
      this.product.Title = this.title;
      this.product.Image = this.image;
      this.product.Price = parseFloat(this.price).toFixed(2).toString();
      this.product.Weight = this.weight.toString();
      this.product.CategoryId = this.categoryid;
      this.product.Description = this.description;
      let year = new Date(this.datepublished).getFullYear();
      let month = new Date(this.datepublished).getMonth()+1;
      let date = new Date(this.datepublished).getDate();
      let tempdate = year+"-"+month+"-"+date;
      this.product.DatePublished = tempdate;

      this.productService.saveproduct(this.product).subscribe(data => {
        this.alertService.success('Successfully saved!')
        this.CloseModal()
        this.productlist = []
        this.GetProducts(0)
        this.GetCategories()
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
    if(this.title == null || this.title == undefined || this.title == ""){
      this.alertService.error('Title is required')
      return false
    }

    if(this.image == null || this.image == undefined || this.image == ""){
      this.alertService.error('Image is required')
      return false
    }

    if(this.price == undefined || this.price == "" || this.price == null){
      this.alertService.error('Price is required')
      return false
    }

    if(this.weight == undefined || this.weight == 0 || this.weight == null){
      this.alertService.error('Weight is required')
      return false
    }

    if(this.categoryid == undefined || this.categoryid == "" || this.categoryid == null){
      this.alertService.error('Category is required')
      return false
    }

    if(this.description == undefined || this.description == "" || this.description == null){
      this.alertService.error('Description is required')
      return false
    }
    return true
  }

  validatePrice(){
    var regex = /^[0-9]*$/
    if(!regex.test(this.price)){
      this.price = ""
    }
  }


  validateWeight(){
    var regex = /^[0-9]*$/
    if(!regex.test(this.weight.toString())){
      this.weight = 0
    }
  }

  CloseModal(){
    this.ModalRef.hide();
    this.Initialize()
  }

  GetProducts(startlimit){
    this.productService.getproducts(startlimit.toString(),"10").subscribe(data => {
      data.forEach(element => {
        var i = this.productlist.findIndex(x=> x.Id  === element.Id)
        if(this.productlist.findIndex(x=> x.Id  === element.Id) == -1){
          this.productlist.push(element)
        }
      });
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }

  GetCategories(){
    this.categoryService.getcategories("0","100").subscribe(data => {
      this.categorylist = data
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }

  ViewProduct(id: string){
    this.alertService.clear()
    this.product = new Product();
    this.product.Id = id
    this.productService.getproductdata(this.product).subscribe(data => {
      this.product = data[0]

      this.id = data[0].Id;
      this.title = data[0].Title;
      this.image = data[0].Image;
      this.price = data[0].Price.toFixed(2).toString();
      this.weight = data[0].Weight;
      this.categoryid = data[0].CategoryId;
      this.category = this.categorylist.find( x=> x.Id  == this.categoryid).Title
      this.description = data[0].Description;
      this.datepublished = new Date(data[0].DatePublished);
      this.showImage = true
      
      this.ModalRef = this.bsModalService.show(this.createnewproduct)
      this.savebtn = false
    },
    error => {
      this.alertService.clear() 
      this.alertService.error('Error!')
    });
  }

  EditProduct(id: string){
    this.alertService.clear()
    this.product = new Product();
    this.product.Id = id
    this.productService.getproductdata(this.product).subscribe(data => {
      this.product = data[0]

      this.id = data[0].Id;
      this.title = data[0].Title;
      this.image = data[0].Image;
      this.price = data[0].Price.toFixed(2).toString();
      this.weight = data[0].Weight;
      this.categoryid = data[0].CategoryId;
      this.category = this.categorylist.find( x=> x.Id  == this.categoryid).Title
      this.description = data[0].Description;
      this.datepublished = new Date(data[0].DatePublished);
      this.showImage = true

      this.ModalRef = this.bsModalService.show(this.createnewproduct)
      this.savebtn = true
    },
    error => {
      this.alertService.clear() 
      this.alertService.error('Error!')
    });
  }

  DeleteProduct(id: string, image: string){
    if(confirm("Are you sure you want to delete this product?")){
      this.alertService.clear()
      this.product = new Product();
      this.product.Id = id
      this.product.Image = image
      this.productService.deleteproduct(this.product).subscribe(data => {
        this.alertService.success('Successfully deleted!')
        this.productlist = []
        this.GetProducts(0)
      },
      error => {
        this.alertService.clear() 
        this.alertService.error('Error!')
      });
    }
  }

  FileUpload(event: any) {
    this.fileToUpload = null
      let data: any
      data = event.target.files[0];
    if(data != null && data != undefined){
      this.fileToUpload = data
      var reader = new FileReader();
      reader.readAsDataURL(data); // read file as data url
      reader.onload = (e) => { // called once readAsDataURL is completed
        this.image = (<FileReader>e.target).result
        this.showImage = true

        this.imageCompress.compressFile(this.image, -1, 50, 50).then(
          result => {
            this.image = result;
            console.warn('Size in bytes is now:', this.image.byteCount(result));
          }
        );
      }
      this.valueChanged = true
    }
  }

  pagination(event){
    if(this.productcount < event){
      var tempcount = Math.abs(event-1.5) * 10
      if(event == 1) tempcount = 0
      this.GetProducts(tempcount) 
    } 
    this.pproducts = event
    this.productcount = event
  }
}

