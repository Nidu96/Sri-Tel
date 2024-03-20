import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { User } from 'src/app/models/user.model'
import { PredictionHistory } from 'src/app/models/prediction-history.model'

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient) {}

    baseUrl = environment.authenticate_service_URL + 'user'

    checkuserexist(user: User): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/checkuserexist`, user)
    }

    register(user: User): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/register`, user)
    }

    saveuser(user: User, loggedInUser: User): Observable<any> {
        var auth: string = loggedInUser.Token
        var options = {
            headers: {
                Authorization: auth,
            },
        }
        return this.http.post<any>(`${this.baseUrl}/saveuser`, user, options)
    }

    saveanalysis(user: User, loggedInUser: User): Observable<any> {
        var auth: string = loggedInUser.Token
        var options = {
            headers: {
                Authorization: auth,
            },
        }
        return this.http.post<any>(`${this.baseUrl}/saveanalysis`, user, options)
    }

    savepredictions(prediction: PredictionHistory, loggedInUser: User): Observable<any> {
        var auth: string = loggedInUser.Token
        var options = {
            headers: {
                Authorization: auth,
            },
        }
        return this.http.post<any>(`${this.baseUrl}/saveprediction`, prediction, options)
    }

    getusers(startlimit: String,endlimit: String,loggedInUser: User): Observable<any> {
        var auth: string = loggedInUser.Token
        var options = {
            headers: {
                Authorization: auth,
            },
        }
        return this.http.post<any>(
            `${this.baseUrl}/getusers`,
            JSON.stringify({ start: startlimit, end: endlimit }),
            options
        )
    }

    getuserdata(user: User): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/getuserdata`, user)
    }

    deleteuser(user: User, loggedInUser: User): Observable<any> {
        var auth: string = loggedInUser.Token
        var options = {
            headers: {
                Authorization: auth,
            },
        }
        return this.http.post<any>(`${this.baseUrl}/deleteuser`, user, options)
    }

    deletepermissions(permissionlist: any, user: User): Observable<any> {
        var auth: string = user.Token
        var options = {
            headers: {
                Authorization: auth,
            },
        }
        return this.http.post<any>(
            `${this.baseUrl}/deletepermissions`,
            permissionlist,
            options
        )
    }

    getpredictions(startlimit: String,endlimit: String,loggedInUser: User): Observable<any> {
        var auth: string = loggedInUser.Token
        var options = {
            headers: {
                Authorization: auth,
            },
        }
        return this.http.post<any>(
            `${this.baseUrl}/getpredictions`,
            JSON.stringify({ start: startlimit, end: endlimit }),
            options
        )
    }

    deleteprediction(id: string, user: User): Observable<any> {
        var auth: string = user.Token
        var options = {
            headers: {
                Authorization: auth,
            },
        }
        return this.http.post<any>(
            `${this.baseUrl}/deleteprediction`,
            id,
            options
        )
    }
}
