import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators' 
import { Product } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';
import { LocalStorage } from 'src/app/util/localstorage.service';
import { Category } from 'src/app/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public selectedProducts: BehaviorSubject<string> = new BehaviorSubject<string>("");
  
  constructor(private http: HttpClient) { }

  refreshshoppingcart(){
    let temp = localStorage.getItem(LocalStorage.SHOPPING_CART)
    let selectedProducts = "0";
    if(temp != undefined && temp != null && temp != ""){
      selectedProducts = (JSON.parse(localStorage.getItem(LocalStorage.SHOPPING_CART))).length;
    }
    this.selectedProducts.next(selectedProducts);
    return;
  }

  refreshProductList(productlist){
    var selectedProducts = JSON.parse(localStorage.getItem(LocalStorage.SHOPPING_CART));
    productlist.forEach(e => {
      if(selectedProducts != null && selectedProducts != undefined && selectedProducts != []){
        var tempproduct = selectedProducts.find( x=> x.Id  == e.Id)
        if(tempproduct != undefined && tempproduct != null){
          e.IsAddedToCart = tempproduct.IsAddedToCart
        }else{
          e.IsAddedToCart = false;
        }
      }
    });
    return productlist;
  }
  
  baseUrl = 'http://localhost:3000/product';

  saveproduct(product: Product): Observable<any> {return this.http.post<any>(`${this.baseUrl}/saveproduct`, product);}

  getproducts(startlimit: String, endlimit: String): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getproducts`, 
  JSON.stringify({start: startlimit,end: endlimit}));}

  getproductdata(product: Product): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getproductdata`, product);}

  getproductoncategory(category: Category): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getproductoncategory`, category);}

  getproductscount(category: Category): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getproductscount`, category);}

  getallproductscount(): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getallproductscount`, null);}

  deleteproduct(product: Product): Observable<any> {return this.http.post<any>(`${this.baseUrl}/deleteproduct`, product);}

  pay(directpay: any): Observable<any> {return this.http.post<any>(`https://testpay.directpay.lk/`, directpay);}
}

