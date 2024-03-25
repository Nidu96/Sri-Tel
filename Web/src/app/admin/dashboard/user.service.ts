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

  	baseUrl = environment.authenticate_service_URL + 'user';

	checkuserexist(user: SystemUser): Observable<any> {return this.http.post<any>(`${this.baseUrl}/checkuserexist`, user);}

	register(user: SystemUser): Observable<any> {return this.http.post<any>(`${this.baseUrl}/register`, user);}

	saveuser(user: SystemUser,loggedInUser: SystemUser): Observable<any> {
		var auth: string = loggedInUser.Token
		var options = {
		  headers: {               
			 'Authorization': auth
		  }
		}
		return this.http.post<any>(`${this.baseUrl}/saveuser`, user,options);
	}

	getusers(startlimit: String, endlimit: String,loggedInUser: SystemUser): Observable<any> {
		var auth: string = loggedInUser.Token
		var options = {
		  headers: {               
			 'Authorization': auth
		  }
		}
		return this.http.post<any>(`${this.baseUrl}/getusers`,JSON.stringify({start: startlimit,end: endlimit}),options);
	}

	getuserdata(user: SystemUser): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getuserdata`, user);}

	deleteuser(user: SystemUser,loggedInUser: SystemUser): Observable<any> {
		var auth: string = loggedInUser.Token
		var options = {
		  headers: {               
			 'Authorization': auth
		  }
		}
		return this.http.post<any>(`${this.baseUrl}/deleteuser`, user,options);
	}

	deletepermissions(permissionlist: any, user: SystemUser): Observable<any> {
		var auth: string = user.Token
		var options = {
		  headers: {               
			 'Authorization': auth
		  }
		}
		return this.http.post<any>(`${this.baseUrl}/deletepermissions`, permissionlist,options);
	}
}
