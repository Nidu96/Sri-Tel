import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    AOS.init();
    if(this.router.url === '/contactus'){
      document.body.style.backgroundImage = "url('assets/images/contactus/ContactUsBanner.png')"; 
      document.body.className = "products-body"
    }
  }

}
