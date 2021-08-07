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

  baseUrl = 'http://localhost:3000/user';

	checkuserexist(user: SystemUser): Observable<any> {return this.http.post<any>(`${this.baseUrl}/checkuserexist`, user);}

	saveuser(user: SystemUser): Observable<any> {return this.http.post<any>(`${this.baseUrl}/saveuser`, user);}

	getusers(): Observable<any> {return this.http.get<any>(`${this.baseUrl}/getusers`);}

	getuserdata(user: SystemUser): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getuserdata`, user);}

	deleteuser(user: SystemUser): Observable<any> {return this.http.post<any>(`${this.baseUrl}/deleteuser`, user);}

	deletepermissions(permissionlist: any): Observable<any> {return this.http.post<any>(`${this.baseUrl}/deletepermissions`, permissionlist);}
}
