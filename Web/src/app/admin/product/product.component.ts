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
  pproducts: number = 1;
  public closeResult = '';
  public ModalRef : BsModalRef;
  public product: Product;

  //form fields
  public id: string;
  public title: string;
  public description: string;
  public datepublished: string;
  public price: string;
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
    this.GetProducts()
    this.GetCategories()
    localStorage.setItem(LocalStorage.LANDING_BODY, "0");
  }

  Initialize(){
    this.id = "";
    this.title = "";
    this.description = "";
    this.category = "";
    this.categoryid = "";
    this.image = "";
    this.showImage = false;
    this.datepublished = new Date().toDateString();
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
      this.product.Price = this.price;
      this.product.CategoryId = this.categoryid;
      this.product.Description = this.description;
      this.product.DatePublished = new Date(this.datepublished);
      this.productService.saveproduct(this.product).subscribe(data => {
        this.alertService.success('Successfully saved!')
        this.CloseModal()
        this.GetProducts()
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

  CloseModal(){
    this.ModalRef.hide();
    this.Initialize()
  }

  GetProducts(){
    this.productService.getproducts().subscribe(data => {
      this.productlist = data
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }

  GetCategories(){
    this.categoryService.getcategories().subscribe(data => {
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
      this.price = data[0].Price;
      this.categoryid = data[0].CategoryId;
      this.category = this.categorylist.find( x=> x.Id  == this.categoryid).Title
      this.description = data[0].Description;
      this.datepublished = data[0].DatePublished.toString();
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
      this.price = data[0].Price;
      this.categoryid = data[0].CategoryId;
      this.category = this.categorylist.find( x=> x.Id  == this.categoryid).Title
      this.description = data[0].Description;
      this.datepublished = data[0].DatePublished.toString();
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
        this.GetProducts()
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
}

