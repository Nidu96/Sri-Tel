import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators' 
import { Banner } from 'src/app/models/banner.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:3000/banner';

  savebanner(banner: Banner): Observable<any> {return this.http.post<any>(`${this.baseUrl}/savebanner`, banner);}

  getbanners(startlimit: String,endlimit: String): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getbanners`, 
  JSON.stringify({start: startlimit,end: endlimit}));}

  getbannerdata(banner: Banner): Observable<any> {return this.http.post<any>(`${this.baseUrl}/getbannerdata`, banner);}

  deletebanner(banner: Banner): Observable<any> {return this.http.post<any>(`${this.baseUrl}/deletebanner`, banner);}
}

