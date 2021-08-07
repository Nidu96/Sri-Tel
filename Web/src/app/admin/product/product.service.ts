import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators' 
import { Product } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:3000/product';

  saveproduct(product: Product): Observable<any> {return this.http.post<any>(`${this.baseUrl}/saveproduct`, product);}

  getproducts(): Observable<any> {return this.http.get<any>(`${this.baseUrl}/getproducts`);}

  getproductdata(product: Product): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getproductdata`, product);}

  deleteproduct(product: Product): Observable<any> {return this.http.post<any>(`${this.baseUrl}/deleteproduct`, product);}
}

