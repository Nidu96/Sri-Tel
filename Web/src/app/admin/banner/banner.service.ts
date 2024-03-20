import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { User } from 'src/app/models/user.model'
import { Banner } from 'src/app/models/banner.model'

@Injectable({
    providedIn: 'root',
})
export class BannerService {
    constructor(private http: HttpClient) {}

    baseUrl = environment.authenticate_service_URL + 'banner'

    savebanner(banner: Banner, user: User): Observable<any> {
        var auth: string = user.Token
        var options = {
            headers: {
                Authorization: auth,
            },
        }
        return this.http.post<any>(
            `${this.baseUrl}/savebanner`,
            banner,
            options
        )
    }

    getbanners(startlimit: String, endlimit: string): Observable<any> {
        return this.http.post<any>(
            `${this.baseUrl}/getbanners`,
            JSON.stringify({ start: startlimit, end: endlimit })
        )
    }

    getbannerdata(banner: Banner): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/getbannerdata`, banner)
    }

    deletebanner(banner: Banner, user: User): Observable<any> {
        var auth: string = user.Token
        var options = {
            headers: {
                Authorization: auth,
            },
        }
        return this.http.post<any>(
            `${this.baseUrl}/deletebanner`,
            banner,
            options
        )
    }
}
