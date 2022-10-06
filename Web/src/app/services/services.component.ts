import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    AOS.init();
    if(this.router.url === '/services'){
      document.body.style.backgroundImage = "url('assets/images/banner2.jpg')"; 
      document.body.className = "products-body"
    }
  }

}
