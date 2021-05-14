import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Credentials } from '../models/credentials.model';
import { LoginService } from './login.service';
import { AlertService } from '../alert/alert.service';
import { SystemUser } from '../models/systemuser.model';
import { UserService } from '../admin/dashboard/user.service';
import { LocalStorage } from '../util/localstorage.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	public loginformhidden: boolean = false;
	public username: string = "";
	public password: string = "";
	public credentials: Credentials
	public user: SystemUser;
	public otp: string;
	public loginattempts: number = 0;
	public otpattempts: number = 0;

	constructor(private router: Router, private loginService: LoginService,
		private alertService: AlertService, private userService: UserService,) {
	}

	ngOnInit() {
	}

	LoginBtnClickEvent(){
		this.alertService.clear()
		localStorage.clear();
		if(this.loginattempts != 3){
			this.credentials = new Credentials();
			this.credentials.Username = this.username
			this.credentials.Password = this.password
	
			this.alertService.info('Please wait..')
			this.loginService.authenticate(this.credentials).subscribe(data => {
				this.alertService.clear()
				this.user = new SystemUser();
	
				this.user.Id = data.id.trim();
				this.user.Name = data.name.trim();
				this.user.NIC = data.nic.trim();
				this.user.DOB = data.dob.trim();
				this.user.Address = data.address.trim();
				this.user.Username = data.username.trim();
				if(data.password != null){
					this.user.Password = data.password.trim();
				}
				this.user.Phone = data.phone.trim();
				this.user.Active = data.active.trim();
				this.user.UserRole = data.userRole.trim();
				if(data.otp != null){
					this.user.OTP = data.otp.trim();
				}
				this.user.PermissionsList = data.permissionlist;

				if(data == null || data == undefined || data == ""){
					this.alertService.error('Invalid username or password')
				}else if(data.password == "invalid"){
					this.alertService.error('You have only ' + (3-this.loginattempts) + ' attempts left')
					this.loginattempts += 1
				}else if(data.username == "usernotexists"){
					this.alertService.error('User does not exists')
				}else if(data.active == "deactive"){
					this.alertService.error('This account is deactivated. please contact the admin to activate')
				}else{
					this.alertService.info('Check your email for the otp')
					localStorage.setItem(LocalStorage.LOGGED_USER, JSON.stringify(this.user));
					this.username = ""
					this.password = ""
					this.loginformhidden = true
					this.loginattempts = 0
				}
			},
			error => { 
				this.alertService.clear()
				this.alertService.error('Error!')
			});
		} else{
			this.userService.getuserdata(this.user).subscribe(data => {
				this.user.Id = data.id.trim();
				this.user.Name = data.name.trim();
				this.user.NIC = data.nic.trim();
				this.user.DOB = data.dob.trim();
				this.user.Address = data.address.trim();
				this.user.Username = data.username.trim();
				if(data.password != null){
					this.user.Password = data.password.trim();
				}
				this.user.Phone = data.phone.trim();
				this.user.Active = data.active.trim();
				this.user.UserRole = data.userRole.trim();
				if(data.otp != null){
					this.user.OTP = data.otp.trim();
				}
				this.user.PermissionsList = data.permissionlist;
				this.user.Active = "deactive";
			  	this.userService.saveuser(this.user).subscribe(data => {
					this.alertService.error('This account is blocked')
				},
				error => { 
					this.alertService.clear()
					this.alertService.error('Error!')
				});
			},
			error => { 
			  this.alertService.clear()
			  this.alertService.error('Error!')
			});
			
		}

	}

	OTPBtnClickEvent(){
		this.alertService.clear()
		if(this.otpattempts != 3){
			if(this.otp == this.user.OTP){
				if(this.user.UserRole == "admin"){
					this.router.navigateByUrl('dashboard')
				}else{
					this.router.navigateByUrl('profile')
				}
				
			} else{
				this.alertService.error('You have only ' + (3-this.otpattempts) + ' attempts left')
				this.otpattempts += 1;
			}
		} else{
			this.userService.getuserdata(this.user).subscribe(data => {
				this.user.Id = data.id.trim();
				this.user.Name = data.name.trim();
				this.user.NIC = data.nic.trim();
				this.user.DOB = data.dob.trim();
				this.user.Address = data.address.trim();
				this.user.Username = data.username.trim();
				if(data.password != null){
					this.user.Password = data.password.trim();
				}
				this.user.Phone = data.phone.trim();
				this.user.Active = data.active.trim();
				this.user.UserRole = data.userRole.trim();
				if(data.otp != null){
					this.user.OTP = data.otp.trim();
				}
				this.user.PermissionsList = data.permissionlist;
				this.user.Active = "deactive";
			  	this.userService.saveuser(this.user).subscribe(data => {
					this.alertService.error('This account is blocked')
				},
				error => { 
				this.alertService.error('Error!')
				});
			},
			error => {
			  this.alertService.clear() 
			  this.alertService.error('Error!')
			});
		}
		
	}
}

