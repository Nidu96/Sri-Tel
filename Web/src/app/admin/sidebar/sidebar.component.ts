import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router) { }

  ngOnInit() {
    if (this.router.url === '/dashboard'){this.sideBaritem = "Dashboard"}
    else if (this.router.url === '/event'){this.sideBaritem = "Event"}
    else if (this.router.url === '/post'){this.sideBaritem = "Post"}
    else if (this.router.url === '/tutorial'){this.sideBaritem = "Tutorial"}
    this.name = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER)).Name;
  }

  Users(){
    this.router.navigateByUrl('dashboard')
    document.getElementById("user").className = "active"; 
  }

  Category(){
    this.router.navigateByUrl('category')
    document.getElementById("category").className = "active"; 
  }

  Product(){
    this.router.navigateByUrl('product')
    document.getElementById("product").className = "active"; 
  }

  Banner(){
    this.router.navigateByUrl('banner')
    document.getElementById("banner").className = "active"; 
  }

  toggleSidebar(){
    this.showSidebar = !this.showSidebar
  }

  Logout(){
    localStorage.clear();
    this.router.navigateByUrl('/')
  }
  
}
