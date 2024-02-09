import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from '../util/localstorage.service';
import { SystemUser } from '../models/systemuser.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public loggedinuser: SystemUser;
  public name: string;
  public search: string;
  public selectedProducts: string;
  public userLoggedIn: boolean = false;
  public isAdmin: boolean = false;
  public isUser: boolean = false;
  public isAdminDashboard: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    if(
      this.router.url === '' ||
      this.router.url === '/' ||
      this.router.url === '/register' ||
      this.router.url === '/login' ||
      this.router.url === '/products' ||
      this.router.url === '/services' ||
      this.router.url === '/about' ||
      this.router.url === '/contactus' ||
      this.router.url === '/terms' ||
      this.router.url === '/gallery' ||
      this.router.url === '/profile' || 
      this.router.url === '/bills' || 
      this.router.url === '/cart' || 
      this.router.url === '/payment')
    {
      localStorage.setItem(LocalStorage.LANDING_BODY, "1");
      this.isAdminDashboard = false
    }else{
      localStorage.setItem(LocalStorage.LANDING_BODY, "0");
      this.isAdminDashboard = true
    }
    this.userLoggedIn = false
    this.isAdmin = false
    this.isUser = false
    this.loggedinuser = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER));
    if(this.loggedinuser != null && this.loggedinuser != undefined){
      this.name = this.loggedinuser.Name
      this.userLoggedIn = true
      if(this.loggedinuser.UserRole == "admin"){
        this.isAdmin = true
      }else{
        this.isUser = true
      }
    }


    let temp = localStorage.getItem(LocalStorage.SHOPPING_CART)
    this.selectedProducts = "0";
    if(temp != undefined && temp != null && temp != ""){
      this.selectedProducts = (JSON.parse(localStorage.getItem(LocalStorage.SHOPPING_CART))).length;
    }
  }

  Logout(){
    localStorage.clear();
    this.router.navigateByUrl('/')
  }

  SearchProduct(){
    
  }

}
