import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Credentials } from '../models/credentials.model';
import { AlertService } from '../alert/alert.service';
import { SystemUser } from '../models/systemuser.model';
import { UserService } from '../admin/dashboard/user.service';
import { LocalStorage } from '../util/localstorage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public closeResult = '';
  public user: SystemUser;

  //form fields
  public id: string;
  public fullname: string;
  public username: string;
  public password: string;
  public confirmpassword: string;
  public status: string;
  public userrole: string;
  public syslist: Array<any>;
  public savebtn: boolean = true
  public savebtnactive: boolean = true

	constructor(private router: Router,private alertService: AlertService, private userService: UserService,) {
	}

  ngOnInit() {
    localStorage.setItem(LocalStorage.LANDING_BODY, "0");
  }

  Initialize(){
    this.id = "";
    this.fullname = "";
    this.username = "";
    this.confirmpassword = "";
    this.password = "";
    this.status = "";
    this.userrole = "";
    this.savebtnactive = true
  }

  RegisterBtnClickEvent(){
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
      this.user.Active = "Active";
      this.user.UserRole = "user"
      this.userService.checkuserexist(this.user).subscribe(data => {
        if(data == false){
          this.userService.saveuser(this.user).subscribe(data => {
            this.alertService.clear()
            this.alertService.success('Successfully saved!')
            localStorage.setItem(LocalStorage.LOGGED_USER, JSON.stringify(this.user));
            this.router.navigateByUrl('/')
            this.Initialize()
          },
          error => { 
            this.alertService.clear()
            this.alertService.error('Error!')
            this.savebtnactive = true
          });
        }else{
          this.alertService.clear()
          this.alertService.error('This email is already registered')
          this.savebtnactive = true
        }
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

    var regex =/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,64}$/;
    if(this.password == null || this.password == undefined || this.password == ""){
      this.alertService.error('Password is required')
      return false
    } else if(!regex.test(this.password)){
      this.alertService.error('Password should contain at least 8 characters, an uppercase Character, a lowercase character,a number and a special character')
      return false
    }

    if(this.confirmpassword == null || this.confirmpassword == undefined || this.confirmpassword == "" || this.confirmpassword != this.password){
      this.alertService.error('Please confirm the password')
      return false
    }

    return true
  }
}
