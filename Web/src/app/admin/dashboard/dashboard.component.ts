import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {NgbDate, NgbModal, ModalDismissReasons, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { BsModalService,BsModalRef}   from 'ngx-bootstrap/modal';
import { AlertService } from 'src/app/alert/alert.service';
import { UserService } from './user.service';
import { DatepickerServiceInputs } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-service';
import { CategoryService } from '../category/category.service';
import { LocalStorage } from 'src/app/util/localstorage.service';
import * as AOS from 'aos';
import { SystemUser } from 'src/app/models/systemuser.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pusers: number = 1;
  ppermissions: number = 1;
  public closeResult = '';
  public ModalRef : BsModalRef;
  public user: SystemUser;

  //form fields
  public id: string;
  public fullname: string;
  public username: string;
  public password: string;
  public status: string;
  public userrole: string;
  public userlist: Array<SystemUser> = []
  public permissionlist: Array<any> = []
  public syslist: Array<any>;
  public savebtn: boolean = true
  public savebtnactive: boolean = true

  @ViewChild('createnewuser', {static: false}) createnewuser: TemplateRef<any>
  
  constructor(private bsModalService :BsModalService, private userService: UserService, 
    private parserFormatter: NgbDateParserFormatter, private alertService: AlertService) { }

  ngOnInit() {
    AOS.init();
    this.GetUsers()
    localStorage.setItem(LocalStorage.LANDING_BODY, "0");
  }

  Initialize(){
    this.id = "";
    this.fullname = "";
    this.username = "";
    this.password = "";
    this.status = "";
    this.userrole = ""
    this.savebtnactive = true
  }

  CreateUser() {
    this.ModalRef = this.bsModalService.show(this.createnewuser)
    this.savebtn = true
    this.savebtnactive = true
    this.Initialize()
  }

  SaveUser(){
    this.alertService.clear()
    this.savebtnactive = false

    if(this.Validations()){
      this.alertService.info('Please wait..')
      this.user = new SystemUser();

      if(this.id != null && this.id != undefined && this.id != ""){
        this.user.Id = this.id.trim();
      }
      this.user.Name = this.fullname.trim();
      this.user.Username = this.username.trim();
      if(this.password != null && this.password != undefined && this.password != ""){
        this.user.Password = this.password.trim();
      }
      this.user.Active = this.status.trim();
      this.user.UserRole = this.userrole.trim();
  
      this.userService.saveuser(this.user).subscribe(data => {
        this.alertService.clear()
        this.alertService.success('Successfully saved!')
        this.CloseModal()
        this.GetUsers()
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
    if(this.fullname == null || this.fullname == undefined || this.fullname == ""){
      this.alertService.error('Name is required')
      return false
    }

    var re = /\S+@\S+\.\S+/;
    if(this.username == null || this.username == undefined || this.username == ""){
      this.alertService.error('Email is required')
      return false
    }else if(!re.test(this.username)){
      this.alertService.error('Invalid email')
      return false
    }

    if(this.status == null || this.status == undefined || this.status == ""){
      this.alertService.error('Status is required')
      return false
    }

    if(this.userrole == null || this.userrole == undefined || this.userrole == ""){
      this.alertService.error('User Role is required')
      return false
    }

    return true
  }

  CloseModal(){
    this.ModalRef.hide();
    this.Initialize()
  }

  GetUsers(){
    this.userService.getusers().subscribe(data => {
      this.userlist = data
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }

  ViewUser(id: string){
    this.alertService.clear()
    this.user = new SystemUser();
    this.user.Id = id
    this.userService.getuserdata(this.user).subscribe(data => {
      this.user = data[0]

      this.id = data[0].Id.trim();
      this.fullname = data[0].Name.trim();
      this.username = data[0].Username.trim();
      this.status = data[0].Active.trim();
      this.userrole = data[0].UserRole.trim();
      
      this.ModalRef = this.bsModalService.show(this.createnewuser)
      this.savebtn = false
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }

  EditUser(id: string){
    this.alertService.clear()
    this.user = new SystemUser();
    this.user.Id = id
    this.userService.getuserdata(this.user).subscribe(data => {
      this.user = data[0]

      this.id = data[0].Id.trim();
      this.fullname = data[0].Name.trim();
      this.username = data[0].Username.trim();
      this.status = data[0].Active.trim();
      this.userrole = data[0].UserRole.trim();

      this.ModalRef = this.bsModalService.show(this.createnewuser)
      this.savebtn = true
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }

  DeleteUser(id: string){
    this.alertService.clear()
    let tmpuser = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER)) as SystemUser;
    if(tmpuser.Id == id){
      this.alertService.error('Cannot delete the logged in user')
    }else{
      if(confirm("Are you sure you want to delete this user?")){
        this.alertService.clear()
        this.user = new SystemUser();
        this.user.Id = id
        this.userService.deleteuser(this.user).subscribe(data => {
          this.alertService.success('Successfully deleted!')
          this.GetUsers()
        },
        error => { 
          this.alertService.clear()
          this.alertService.error('Error!')
        });
      }
    }
  }
}
