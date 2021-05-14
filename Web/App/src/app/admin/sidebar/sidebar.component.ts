import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
  }

  Users(){
    this.router.navigateByUrl('dashboard')
    document.getElementById("user").className = "active"; 
    //document.getElementById("accesscontrol").className = "inactive"; 
  }

  AccessControl(){
    this.router.navigateByUrl('access-control')
    document.getElementById("accesscontrol").className = "active"; 
    //document.getElementById("user").className = "inactive"; 
  }
}
