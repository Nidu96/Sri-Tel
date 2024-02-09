import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { AlertService } from '../alert/alert.service';
import { SystemUser } from '../models/systemuser.model';
import { LocalStorage } from '../util/localstorage.service';
import { ServicesService } from './services.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  public user: SystemUser;
  public loggedInUser: SystemUser;
  public roaming: string;
  public ringingtone: string;
  public work: string;
  public student: string;
  public workstudent: string;
  public family: string;
  public familyplus: string;

  constructor(private router: Router,private alertService: AlertService,private servicesService: ServicesService,) { }

  ngOnInit() {
    AOS.init();
    if(this.router.url === '/services'){
      document.body.style.backgroundImage = "url('assets/images/banner2.jpg')"; 
      document.body.className = "products-body"
    }
    this.loggedInUser = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER)) as SystemUser;
    if(this.loggedInUser == null || this.loggedInUser == undefined){
      this.Initialize();
    }else{
      if(this.loggedInUser.Roaming == "Deactive"){this.roaming = "Activate"}else{this.roaming = "Deactivate"}
      if(this.loggedInUser.RingingTone == "Deactive"){this.ringingtone = "Activate"}else{this.ringingtone = "Deactivate"}
      if(this.loggedInUser.WorkPackage == "Deactive"){this.work = "Activate"}else{this.work = "Deactivate"}
      if(this.loggedInUser.StudentPackage == "Deactive"){this.student = "Activate"}else{this.student = "Deactivate"}
      if(this.loggedInUser.WorkStudentPackage == "Deactive"){this.workstudent = "Activate"}else{this.workstudent = "Deactivate"}
      if(this.loggedInUser.FamilyPackage == "Deactive"){this.family = "Activate"}else{this.family = "Deactivate"}
      if(this.loggedInUser.FamilyPlusPackage == "Deactive"){this.familyplus = "Activate"}else{this.familyplus = "Deactivate"}
    }
  }

  Initialize(){
    this.roaming = "Activate";
    this.ringingtone = "Activate";
    this.work = "Activate";
    this.student = "Activate";
    this.workstudent = "Activate";
    this.family = "Activate";
    this.familyplus = "Activate";
  }

  SaveRoaming(){
    if(this.loggedInUser == null || this.loggedInUser == undefined){
      this.router.navigate(['/login']);
    } else{
      if(this.roaming == "Activate"){
        this.loggedInUser.Roaming = "Active";
        this.roaming = "Deactivate"
      } else{
        this.loggedInUser.Roaming = "Deactive";
        this.roaming = "Activate"
      }
      this.SaveActivationDeactivation();
    }
  }

  SaveRingingTone(){
    if(this.loggedInUser == null || this.loggedInUser == undefined){
      this.router.navigate(['/login']);
    } else{
      if(this.ringingtone == "Activate"){
        this.loggedInUser.RingingTone = "Active";
        this.ringingtone = "Deactivate"
      } else{
        this.loggedInUser.RingingTone = "Deactive";
        this.ringingtone = "Activate"
      }
      this.SaveActivationDeactivation();
    }
  }

  SaveWork(){
    if(this.loggedInUser == null || this.loggedInUser == undefined){
      this.router.navigate(['/login']);
    } else{
      if(this.work == "Activate"){
        this.loggedInUser.WorkPackage = "Active";
        this.work = "Deactivate"
      } else{
        this.loggedInUser.WorkPackage = "Deactive";
        this.work = "Activate"
      }
      this.SaveActivationDeactivation();
    }
  }

  SaveStudent(){
    if(this.loggedInUser == null || this.loggedInUser == undefined){
      this.router.navigate(['/login']);
    } else{
      if(this.workstudent == "Activate"){
        this.loggedInUser.StudentPackage = "Active";
        this.student = "Deactivate"
      } else{
        this.loggedInUser.StudentPackage = "Deactive";
        this.student = "Activate"
      }
      this.SaveActivationDeactivation();
    }
  }

  SaveWorkStudent(){
    if(this.loggedInUser == null || this.loggedInUser == undefined){
      this.router.navigate(['/login']);
    } else{
      if(this.workstudent == "Activate"){
        this.loggedInUser.WorkStudentPackage = "Active";
        this.workstudent = "Deactivate"
      } else{
        this.loggedInUser.WorkStudentPackage = "Deactive";
        this.workstudent = "Activate"
      }
      this.SaveActivationDeactivation();
    }
  }

  SaveFamily(){
    if(this.loggedInUser == null || this.loggedInUser == undefined){
      this.router.navigate(['/login']);
    } else{
      if(this.family == "Activate"){
        this.loggedInUser.FamilyPackage = "Active";
        this.family = "Deactivate"
      } else{
        this.loggedInUser.FamilyPackage = "Deactive";
        this.family = "Activate"
      }
      this.SaveActivationDeactivation();
    } 
  }

  SaveFamilyPlus(){
    if(this.loggedInUser == null || this.loggedInUser == undefined){
      this.router.navigate(['/login']);
    } else{
      if(this.familyplus == "Activate"){
        this.loggedInUser.FamilyPlusPackage = "Active";
        this.familyplus = "Deactivate"
      } else{
        this.loggedInUser.FamilyPlusPackage = "Deactive";
        this.familyplus = "Activate"
      }
      this.SaveActivationDeactivation();
    }
  }

  SaveActivationDeactivation(){
    this.alertService.clear()
    localStorage.setItem(LocalStorage.LOGGED_USER, JSON.stringify(this.loggedInUser));
    this.servicesService.saveservice(this.loggedInUser,this.loggedInUser).subscribe(data => {
        this.alertService.success('Successfully saved!')
      },
      error => {
        this.alertService.clear() 
        this.alertService.error('Error!')
      });
    }

}
