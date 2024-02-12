import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators' 
import { SystemUser } from 'src/app/models/systemuser.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FactorsService {

  	constructor(private http: HttpClient) { }

  	baseUrl = environment.factors_URL + 'services';

	saveservice(user: SystemUser,loggedInUser: SystemUser): Observable<any> {
		var auth: string = loggedInUser.Token
		var options = {
		  headers: {               
			 'Authorization': auth
		  }
		}
		return this.http.post<any>(`${this.baseUrl}/saveservice`, user,options);
	}
}
