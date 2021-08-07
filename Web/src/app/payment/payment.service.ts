import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators' 
import { Product } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  payment(paymentdetails: FormData): Observable<any> {
 	const httpOptions = {
		headers: new HttpHeaders({
			'Accept': 'application/json'
		})
    } 
	return this.http.post<any>(environment.server_URL + environment.router_prefix + 'Payment/payment', paymentdetails,httpOptions)
			 .pipe()
	}
}

