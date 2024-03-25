import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Bill, Payment } from '../models/payment.model';
import { SystemUser } from '../models/systemuser.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

	baseUrl = environment.bills_service_URL + 'bills';

	payment(paymentdetails: FormData): Observable<any> {return this.http.post<any>(`${this.baseUrl}/payment`, paymentdetails);}

  savebill(bill: Bill,user: SystemUser): Observable<any> {
    var auth: string = user.Token
    var options = {
      headers: {               
         'Authorization': auth
      }
    }
    return this.http.post<any>(`${this.baseUrl}/savebill`, bill,options);}

  getbills(userId: String,user: SystemUser): Observable<any> {
      var auth: string = user.Token
      var options = {
        headers: {               
           'Authorization': auth
        }
      }
    return this.http.post<any>(`${this.baseUrl}/getbills`, userId,options);}
}

