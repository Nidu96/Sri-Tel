import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    AOS.init();
    if(this.router.url === '/about'){
      document.body.style.backgroundImage = "url('assets/images/aboutus/AboutUsBanner.png')"; 
      document.body.className = "products-body"
    }
  }

}
