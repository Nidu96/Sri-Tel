import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators' 
import { AccessControl } from 'src/app/models/accesscontrol.mode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {

  constructor(private http: HttpClient) { }

  saveaccesscontrol(accesscontrol: AccessControl): Observable<any> {
 	const httpOptions = {
		headers: new HttpHeaders({
			'Accept': 'application/json',
			'Content-type': 'application/json'
		})
    } 
	return this.http.post<any>(environment.server_URL + environment.router_prefix + 'AccessControls/saveaccesscontrol', JSON.stringify(accesscontrol),httpOptions)
			 .pipe()
	}

  getaccesscontrols(): Observable<any> {
 	const httpOptions = {
		headers: new HttpHeaders({
			'Accept': 'application/json',
			'Content-type': 'application/json'
		})
    } 
	return this.http.post<any>(environment.server_URL + environment.router_prefix + 'AccessControls/getaccesscontrols', null,httpOptions)
			 .pipe()
	}


  getaccesscontroldata(accesscontrol: AccessControl): Observable<any> {
 	const httpOptions = {
		headers: new HttpHeaders({
			'Accept': 'application/json',
			'Content-type': 'application/json'
		})
    } 
	return this.http.post<any>(environment.server_URL + environment.router_prefix + 'AccessControls/getaccesscontroldata', JSON.stringify(accesscontrol),httpOptions)
			 .pipe()
	}


  deleteaccesscontrol(accesscontrol: AccessControl): Observable<any> {
 	const httpOptions = {
		headers: new HttpHeaders({
			'Accept': 'application/json',
			'Content-type': 'application/json'
		})
    } 
	return this.http.post<any>(environment.server_URL + environment.router_prefix + 'AccessControls/deleteaccesscontrol', JSON.stringify(accesscontrol),httpOptions)
			 .pipe()
	}
}

