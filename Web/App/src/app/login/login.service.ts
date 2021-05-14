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

  authenticate(credentials: Credentials): Observable<any> {
 
		const httpOptions = {
			 headers: new HttpHeaders({
				 'Accept': 'application/json',
				 'Content-type': 'application/json'
			 })
    } 
		return this.http.post<any>(environment.server_URL + environment.router_prefix + 'Auth/authenticate', JSON.stringify(credentials),httpOptions)
			 .pipe()
	}
}
