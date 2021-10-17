import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {NgbDate, NgbModal, ModalDismissReasons, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { BsModalService,BsModalRef}   from 'ngx-bootstrap/modal';
import { SystemUser } from 'src/app/models/systemuser.model';
import { AlertService } from 'src/app/alert/alert.service';
import { BannerService } from './banner.service';
import { DatepickerServiceInputs } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-service';
import { Banner } from 'src/app/models/banner.model';
import { LocalStorage } from 'src/app/util/localstorage.service';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  pbanners: number = 1;
  public closeResult = '';
  public ModalRef : BsModalRef;
  public banner: Banner;

  //form fields
  public id: string;
  public title: string;
  public description: string;
  public datepublished: string;
  public fileToUpload;
  public image;
  public showImage: boolean = false;
  public valueChanged: boolean = false;
  public bannerlist: Array<Banner> = []
  public savebtn: boolean = true
  public savebtnactive: boolean = true

  @ViewChild('createnewbanner', {static: false}) createnewbanner: TemplateRef<any>
  
  constructor(private bsModalService :BsModalService, private bannerService: BannerService, 
    private parserFormatter: NgbDateParserFormatter, private alertService: AlertService,private imageCompress: NgxImageCompressService) { }

  ngOnInit() {
    this.GetBanners()
    localStorage.setItem(LocalStorage.LANDING_BODY, "0");
  }

  Initialize(){
    this.id = "";
    this.title = "";
    this.description = "";
    this.image = "";
    this.showImage = false;
    this.datepublished = new Date().toDateString();
    this.savebtnactive = true
  }

  CreateBanner() {
    this.ModalRef = this.bsModalService.show(this.createnewbanner)
    this.savebtn = true
    this.savebtnactive = true
    this.Initialize()
  }

  SaveBanner(){
    this.alertService.clear()
    this.savebtnactive = false

    if(this.Validations()){
      this.banner = new Banner();

      if(this.id != null && this.id != undefined && this.id != ""){
        this.banner.Id = this.id;
      }
      this.banner.Title = this.title;
      this.banner.Image = this.image;
      this.banner.Description = this.description;
      this.banner.DatePublished = new Date(this.datepublished);
      this.bannerService.savebanner(this.banner).subscribe(data => {
        this.alertService.success('Successfully saved!')
        this.CloseModal()
        this.GetBanners()
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
    return true
  }

  CloseModal(){
    this.ModalRef.hide();
    this.Initialize()
  }

  GetBanners(){
    this.bannerService.getbanners().subscribe(data => {
      this.bannerlist = data
      
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }

  ViewBanner(id: string){
    this.alertService.clear()
    this.banner = new Banner();
    this.banner.Id = id
    this.bannerService.getbannerdata(this.banner).subscribe(data => {
      this.banner = data[0]

      this.id = data[0].Id;
      this.title = data[0].Title;
      this.image = data[0].Image;
      this.description = data[0].Description;
      this.datepublished = data[0].DatePublished.toString();
      this.showImage = true
      
      this.ModalRef = this.bsModalService.show(this.createnewbanner)
      this.savebtn = false
    },
    error => {
      this.alertService.clear() 
      this.alertService.error('Error!')
    });
  }

  EditBanner(id: string){
    this.alertService.clear()
    this.banner = new Banner();
    this.banner.Id = id
    this.bannerService.getbannerdata(this.banner).subscribe(data => {
      this.banner = data[0]

      this.id = data[0].Id;
      this.title = data[0].Title;
      this.image = data[0].Image;
      this.description = data[0].Description;
      this.datepublished = data[0].DatePublished.toString();
      this.showImage = true

      this.ModalRef = this.bsModalService.show(this.createnewbanner)
      this.savebtn = true
    },
    error => {
      this.alertService.clear() 
      this.alertService.error('Error!')
    });
  }

  DeleteBanner(id: string, image: string){
    if(confirm("Are you sure you want to delete this Banner?")){
      this.alertService.clear()
      this.banner = new Banner();
      this.banner.Id = id
      this.banner.Image = image
      this.bannerService.deletebanner(this.banner).subscribe(data => {
        this.alertService.success('Successfully deleted!')
        this.GetBanners()
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

