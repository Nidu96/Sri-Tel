import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SystemUser } from 'src/app/models/systemuser.model';
import { LocalStorage } from 'src/app/util/localstorage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public showSidebar: boolean = true;
  public sideBaritem: string = "Dashboard";
  public name: string;
  public loggedInUser: SystemUser;
  public userLoggedIn: boolean = false;
  public isAdminDashboard: boolean = false;


  constructor(private router: Router) { }

  ngOnInit() {
    if (this.router.url === '/dashboard'){this.sideBaritem = "Dashboard"}
    else if (this.router.url === '/banner'){this.sideBaritem = "Banner Images"}
    else if (this.router.url === '/profile'){this.sideBaritem = "Profile"}
    else if (this.router.url === '/graphs'){this.sideBaritem = "Graphs"}
    else if (this.router.url === '/riskanalysis'){this.sideBaritem = "Risk Analysis"}
    this.loggedInUser = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER));
    this.name = this.loggedInUser.Name;
    
    if(this.loggedInUser != null && this.loggedInUser != undefined){
      this.name = this.loggedInUser.Name
      this.userLoggedIn = true
      if(this.loggedInUser.UserRole == "admin"){
        this.isAdminDashboard = true
      }else{
        this.isAdminDashboard = false
      }
    }
  }

  Profile(){
    this.router.navigateByUrl('profile')
    document.getElementById("profile").className = "active"; 
  }

  RiskAnalysis(){
    this.router.navigateByUrl('riskanalysis')
    document.getElementById("riskanalysis").className = "active"; 
  }

  Graphs(){
    this.router.navigateByUrl('graphs')
    document.getElementById("graphs").className = "active"; 
  }

  Users(){
    if(this.isAdminDashboard){
      this.router.navigateByUrl('dashboard')
      document.getElementById("user").className = "active"; 
    }
  }

  Banner(){
    if(this.isAdminDashboard){
      this.router.navigateByUrl('banner')
      document.getElementById("banner").className = "active"; 
    }
  }

  toggleSidebar(){
    this.showSidebar = !this.showSidebar
  }

  Logout(){
    localStorage.clear();
    this.router.navigateByUrl('/')
  }
  
}
