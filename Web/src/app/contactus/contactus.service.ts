import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { User } from 'src/app/models/User.model'
import { ContactUsMessage } from '../models/ContactUsMessage.model'

@Injectable({
    providedIn: 'root',
})
export class ContactusService {
    constructor(private http: HttpClient) {}

    baseUrl = environment.authenticate_service_URL + 'contactus'

    contactmessage(contactusmessage: ContactUsMessage): Observable<any> {
        return this.http.post<any>(
            `${this.baseUrl}/savemessage`,
            contactusmessage
        )
    }
}
