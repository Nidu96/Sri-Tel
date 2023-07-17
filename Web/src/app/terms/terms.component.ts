import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    AOS.init();
    if(this.router.url === '/terms'){
      document.body.style.backgroundImage = "url('assets/images/banner2.jpg')"; 
      document.body.className = "products-body"
    }
  }

}
