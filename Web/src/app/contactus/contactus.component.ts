import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { AlertService } from '../alert/alert.service';
import { ContactUsMessage } from '../models/ContactUsMessage.model';
import { ContactusService } from './contactus.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {

  public fullname: string;
  public email: string;
  public message: string;
  public savebtnactive: boolean = true
  public contactusmessage: ContactUsMessage;

  constructor(private router: Router,private alertService: AlertService,private contactusService: ContactusService) { }

  ngOnInit() {
    AOS.init();
    if(this.router.url === '/contactus'){
      document.body.style.backgroundImage = "url('assets/images/contactus/ContactUsBanner.png')"; 
      document.body.className = "products-body"
    }
  }

  ContactUsBtnClickEvent(){
    this.alertService.clear()
    this.savebtnactive = false

    if(this.Validations()){
      this.contactusmessage = new ContactUsMessage();

      this.contactusmessage.FullName = this.fullname;
      this.contactusmessage.Email = this.email;
      this.contactusmessage.Message = this.message;
      let year = new Date().getFullYear();
      let month = new Date().getMonth()+1;
      let date = new Date().getDate();
      let tempdate = year+"-"+month+"-"+date;
      this.contactusmessage.DatePublished = tempdate;
      
      this.contactusService.contactmessage(this.contactusmessage).subscribe(data => {
        this.alertService.success('Successfully saved!')
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

    if(this.email == null || this.email == undefined || this.email == ""){
      this.alertService.error('Email is required')
      return false
    }

    if(this.message == null || this.message == undefined || this.message == ""){
      this.alertService.error('Message is required')
      return false
    }
    return true
  }

}
