import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

	baseUrl = 'https://agrolinks.lk:3000/payment';

	payment(paymentdetails: FormData): Observable<any> {return this.http.post<any>(`${this.baseUrl}/payment`, paymentdetails);}
}

