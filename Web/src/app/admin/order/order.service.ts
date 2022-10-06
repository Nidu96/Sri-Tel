import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators' 
import { Banner } from 'src/app/models/banner.model';
import { environment } from 'src/environments/environment';
import { Order } from 'src/app/models/order.model';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  baseUrl = 'https://agrolinks.lk:3000/order';

  saveorder(order: Order): Observable<any> {return this.http.post<any>(`${this.baseUrl}/saveorder`, order);}

  getorders(startlimit: String,endlimit: String): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getorders`,
  JSON.stringify({start: startlimit,end: endlimit}));}

  getorderdata(order: Order): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getorderdata`, order);}

  deleteorder(order: Order): Observable<any> {return this.http.post<any>(`${this.baseUrl}/deleteorder`, order);}
}

