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
  public loggedInUser: SystemUser;

  //form fields
  public id: string;
  public fullname: string;
  public username: string;
  public phone: string;
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
    this.loggedInUser = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER)) as SystemUser;
    localStorage.setItem(LocalStorage.LANDING_BODY, "0");
    this.fullname = this.loggedInUser.Name;
    this.username = this.loggedInUser.Username;
    this.password = this.loggedInUser.Password;
    this.confirmpassword = this.loggedInUser.Password;
    this.phone = this.loggedInUser.Phone;
  }

  SaveUser(){
    this.alertService.clear()

    if(this.Validations()){
      this.alertService.info('Please wait..')

      this.loggedInUser.Name = this.fullname.trim();
      this.loggedInUser.Username = this.username.trim();
      if(this.password != null && this.password != undefined && this.password != ""){
        this.loggedInUser.Password = this.password.trim();
      }
      this.loggedInUser.Phone = this.phone.trim();
      this.userService.saveuser(this.loggedInUser, this.loggedInUser).subscribe(data => {
        this.alertService.clear()
        this.alertService.success('Successfully saved!')
        localStorage.setItem(LocalStorage.LOGGED_USER, JSON.stringify(this.loggedInUser));
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

    if(this.phone == null || this.phone == undefined || this.phone == ""){
      this.alertService.error('Phone is required')
      return false
    }

    if(this.confirmpassword == null || this.confirmpassword == undefined || this.confirmpassword == "" || this.confirmpassword != this.password){
      this.alertService.error('Please confirm the password')
      return false
    }

    return true
  }
}
