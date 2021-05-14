import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators' 
import { SystemUser } from 'src/app/models/systemuser.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  saveuser(user: SystemUser): Observable<any> {
 	const httpOptions = {
		headers: new HttpHeaders({
			'Accept': 'application/json',
			'Content-type': 'application/json'
		})
    } 
	return this.http.post<any>(environment.server_URL + environment.router_prefix + 'SystemUsers/saveuser', JSON.stringify(user),httpOptions)
			 .pipe()
	}

  getusers(): Observable<any> {
 	const httpOptions = {
		headers: new HttpHeaders({
			'Accept': 'application/json',
			'Content-type': 'application/json'
		})
    } 
	return this.http.post<any>(environment.server_URL + environment.router_prefix + 'SystemUsers/getusers', null,httpOptions)
			 .pipe()
	}


  getuserdata(user: SystemUser): Observable<any> {
 	const httpOptions = {
		headers: new HttpHeaders({
			'Accept': 'application/json',
			'Content-type': 'application/json'
		})
    } 
	return this.http.post<any>(environment.server_URL + environment.router_prefix + 'SystemUsers/getuserdata', JSON.stringify(user),httpOptions)
			 .pipe()
	}


  deleteuser(user: SystemUser): Observable<any> {
 	const httpOptions = {
		headers: new HttpHeaders({
			'Accept': 'application/json',
			'Content-type': 'application/json'
		})
    } 
	return this.http.post<any>(environment.server_URL + environment.router_prefix + 'SystemUsers/deleteuser', JSON.stringify(user),httpOptions)
			 .pipe()
	}
}
