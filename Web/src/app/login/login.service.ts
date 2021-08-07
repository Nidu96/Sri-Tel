import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credentials } from '../models/credentials.model';
import { map } from 'rxjs/operators' 

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:3000/auth';

  authenticate(credentials: Credentials): Observable<any> {return this.http.post<any>(`${this.baseUrl}/authenticate`, credentials);}
}
