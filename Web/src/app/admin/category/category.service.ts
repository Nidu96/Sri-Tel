import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators' 
import { Category } from 'src/app/models/category.model';
import { environment } from 'src/environments/environment';
import { SystemUser } from 'src/app/models/systemuser.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }
  baseUrl = 'https://agrolinks.lk:3000/category';

  savecategory(category: Category,user: SystemUser): Observable<any> {
    var auth: string = user.Token
    var options = {
      headers: {               
         'Authorization': auth
      }
    }

    return this.http.post<any>(`${this.baseUrl}/savecategory`, category,options);
  }

  getcategories(startlimit: String,endlimit: String): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getcategories`,
  JSON.stringify({start: startlimit,end: endlimit}));}

  getcategorydata(category: Category): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getcategorydata`, category);}

  deletecategory(category: Category,user: SystemUser): Observable<any> {
    var auth: string = user.Token
    var options = {
      headers: {               
         'Authorization': auth
      }
    }

    return this.http.post<any>(`${this.baseUrl}/deletecategory`, category,options);
  }
}

