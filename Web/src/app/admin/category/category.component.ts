import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {NgbDate, NgbModal, ModalDismissReasons, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { BsModalService,BsModalRef}   from 'ngx-bootstrap/modal';
import { SystemUser } from 'src/app/models/systemuser.model';
import { AlertService } from 'src/app/alert/alert.service';
import { CategoryService } from './category.service';
import { DatepickerServiceInputs } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-service';
import { Category } from 'src/app/models/category.model';
import { LocalStorage } from 'src/app/util/localstorage.service';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  pcategories: number = 1;
  public closeResult = '';
  public ModalRef : BsModalRef;
  public category: Category;

  //form fields
  public id: string;
  public title: string;
  public description: string;
  public datepublished: string;
  public fileToUpload;
  public icon;
  public showImage: boolean = false;
  public valueChanged: boolean = false;
  public categorylist: Array<Category> = []
  public savebtn: boolean = true
  public savebtnactive: boolean = true

  @ViewChild('createnewcategory', {static: false}) createnewcategory: TemplateRef<any>
  
  constructor(private bsModalService :BsModalService, private categoryService: CategoryService, 
    private parserFormatter: NgbDateParserFormatter, private alertService: AlertService,private imageCompress: NgxImageCompressService) { }

  ngOnInit() {
    this.GetCategories()
    localStorage.setItem(LocalStorage.LANDING_BODY, "0");
  }

  Initialize(){
    this.id = "";
    this.title = "";
    this.icon = "";
    this.description = "";
    this.showImage = false;
    this.datepublished = new Date().toDateString();
    this.savebtnactive = true
  }

  CreateCategory() {
    this.ModalRef = this.bsModalService.show(this.createnewcategory)
    this.savebtn = true
    this.savebtnactive = true
    this.Initialize()
  }

  SaveCategory(){
    this.alertService.clear()
    this.savebtnactive = false

    if(this.Validations()){
      this.category = new Category();

      if(this.id != null && this.id != undefined && this.id != ""){
        this.category.Id = this.id.trim();
      }
      this.category.Title = this.title;
      this.category.Icon = this.icon;
      this.category.Description = this.description;
      this.category.DatePublished = new Date(this.datepublished);
      this.categoryService.savecategory(this.category).subscribe(data => {
        this.alertService.success('Successfully saved!')
        this.CloseModal()
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
    return true
  }

  CloseModal(){
    this.ModalRef.hide();
    this.Initialize()
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

  ViewCategory(id: string){
    this.alertService.clear()
    this.category = new Category();
    this.category.Id = id
    this.categoryService.getcategorydata(this.category).subscribe(data => {
      this.category = data[0]

      this.id = data[0].Id;
      this.title = data[0].Title;
      this.icon = data[0].Image;
      this.description = data[0].Description;
      this.datepublished = data[0].DatePublished.toString();
      this.showImage = true
      
      this.ModalRef = this.bsModalService.show(this.createnewcategory)
      this.savebtn = false
    },
    error => {
      this.alertService.clear() 
      this.alertService.error('Error!')
    });
  }

  EditCategory(id: string){
    this.alertService.clear()
    this.category = new Category();
    this.category.Id = id
    this.categoryService.getcategorydata(this.category).subscribe(data => {
      this.category = data[0]

      this.id = data[0].Id;
      this.title = data[0].Title;
      this.icon = data[0].Image;
      this.description = data[0].Description;
      this.datepublished = data[0].DatePublished.toString();
      this.showImage = true

      this.ModalRef = this.bsModalService.show(this.createnewcategory)
      this.savebtn = true
    },
    error => {
      this.alertService.clear() 
      this.alertService.error('Error!')
    });
  }

  DeleteCategory(id: string, icon: string){
    if(confirm("Are you sure you want to delete this Category?")){
      this.alertService.clear()
      this.category = new Category();
      this.category.Id = id
      this.category.Icon = icon
      this.categoryService.deletecategory(this.category).subscribe(data => {
        this.alertService.success('Successfully deleted!')
        this.GetCategories()
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
        this.icon = (<FileReader>e.target).result
        this.showImage = true

        this.imageCompress.compressFile(this.icon, -1, 50, 50).then(
          result => {
            this.icon = result;
            console.warn('Size in bytes is now:', this.icon.byteCount(result));
          }
        );
      }
      this.valueChanged = true
    }
  }
}

