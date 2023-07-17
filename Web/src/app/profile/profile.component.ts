import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {NgbDate, NgbModal, ModalDismissReasons, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { BsModalService,BsModalRef}   from 'ngx-bootstrap/modal';
import { SystemUser} from 'src/app/models/systemuser.model';
import { AlertService } from 'src/app/alert/alert.service';
import { LocalStorage } from 'src/app/util/localstorage.service';
import * as AOS from 'aos';
import { UserService } from '../admin/dashboard/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public closeResult = '';
  public ModalRef : BsModalRef;
  public user: SystemUser;

  //form fields
  public id: string;
  public fullname: string;
  public username: string;
  public password: string;
  public confirmpassword: string;
  public status: string;
  public userrole: string;
  public userlist: Array<SystemUser> = []
  public syslist: Array<any>;
  public savebtn: boolean = true

  @ViewChild('createnewuser', {static: false}) createnewuser: TemplateRef<any>
  
  constructor(private bsModalService :BsModalService, private userService: UserService, 
    private parserFormatter: NgbDateParserFormatter, private alertService: AlertService) { }

  ngOnInit() {
    AOS.init();
    this.user = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER)) as SystemUser;
    this.GetUser(this.user.Id)
    localStorage.setItem(LocalStorage.LANDING_BODY, "0");
  }

  SaveUser(){
    this.alertService.clear()

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
  
      this.userService.register(this.user).subscribe(data => {
        this.alertService.clear()
        this.alertService.success('Successfully saved!')
        this.GetUser(this.user.Id)
      },
      error => { 
        this.alertService.clear()
        this.alertService.error('Error!')
      });
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

    if(this.confirmpassword == null || this.confirmpassword == undefined || this.confirmpassword == "" || this.confirmpassword != this.password){
      this.alertService.error('Please confirm the password')
      return false
    }

    return true
  }


  GetUser(id: string){
    this.user = new SystemUser();
    this.user.Id = id
    this.userService.getuserdata(this.user).subscribe(data => {
      this.user = data[0]

      this.id = this.user.Id;
      this.fullname = this.user.Name;
      this.username = this.user.Username;
      this.password = this.user.Password;
      this.confirmpassword = this.user.Password;
      this.status = this.user.Active;
      this.userrole = this.user.UserRole;
      localStorage.setItem(LocalStorage.LOGGED_USER, JSON.stringify(this.user));
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }
}
