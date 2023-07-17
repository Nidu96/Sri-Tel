import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators' 
import { Banner } from 'src/app/models/banner.model';
import { environment } from 'src/environments/environment';
import { Order } from 'src/app/models/order.model';
import { SystemUser } from 'src/app/models/systemuser.model';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  baseUrl = 'https://agrolinks.lk:3000/order';

  saveorder(order: Order,loggedInUser: SystemUser): Observable<any> {
    var auth: string = loggedInUser.Token
	var options = {
		headers: {               
			'Authorization': auth
		}
	}
    return this.http.post<any>(`${this.baseUrl}/saveorder`, order,options);}

  getorders(startlimit: String,endlimit: String,loggedInUser: SystemUser): Observable<any> {
    var auth: string = loggedInUser.Token
	var options = {
		headers: {               
			'Authorization': auth
		}
	}
    return this.http.post<any>(`${this.baseUrl}/getorders`,JSON.stringify({start: startlimit,end: endlimit}),options);
  }

  getorderdata(order: Order,loggedInUser: SystemUser): Observable<any> {
    var auth: string = loggedInUser.Token
	var options = {
		headers: {               
			'Authorization': auth
		}
	}
    return this.http.post<any>(`${this.baseUrl}/getorderdata`, order,options);
  }

  deleteorder(order: Order,loggedInUser: SystemUser): Observable<any> {
    var auth: string = loggedInUser.Token
	var options = {
		headers: {               
			'Authorization': auth
		}
	}
    return this.http.post<any>(`${this.baseUrl}/deleteorder`, order,options);
  }
}

