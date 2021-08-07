import { Component } from '@angular/core';
import { LocalStorage } from './util/localstorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'App';
  constructor(private router: Router) { }
  
  ngOnInit() {
    // if(localStorage.getItem(LocalStorage.LANDING_BODY) == "1"){
    //   document.getElementById("landingbody").hidden = false; 
    //   document.getElementById("adminbody").hidden = true; 
    // }else{
    //   document.getElementById("landingbody").hidden = true; 
    //   document.getElementById("adminbody").hidden = false; 
    // }
  }
}
