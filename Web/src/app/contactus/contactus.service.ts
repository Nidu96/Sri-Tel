import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators' 
import { Banner } from 'src/app/models/banner.model';
import { environment } from 'src/environments/environment';
import { SystemUser } from 'src/app/models/systemuser.model';
import { ContactUsMessage } from '../models/ContactUsMessage.model';

@Injectable({
  providedIn: 'root'
})
export class ContactusService {

  constructor(private http: HttpClient) { }

  baseUrl = 'https://agrolinks.lk:3000/contactus';

  contactmessage(contactusmessage: ContactUsMessage): Observable<any> {return this.http.post<any>(`${this.baseUrl}/savemessage`, contactusmessage);}
}

