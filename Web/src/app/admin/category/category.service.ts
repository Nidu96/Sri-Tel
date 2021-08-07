import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators' 
import { Category } from 'src/app/models/category.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }
  baseUrl = 'http://localhost:3000/category';

  savecategory(category: Category): Observable<any> {return this.http.post<any>(`${this.baseUrl}/savecategory`, category);}

  getcategories(): Observable<any> {return this.http.get<any>(`${this.baseUrl}/getcategories`);}

  getcategorydata(category: Category): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getcategorydata`, category);}

  deletecategory(category: Category): Observable<any> {return this.http.post<any>(`${this.baseUrl}/deletecategory`, category);}
}
