import { Injectable } from "../../../node_modules/@angular/core";

@Injectable({providedIn: 'root'})
export class LocalStorage {
    constructor(){}
    public static LOGGED_USER: string = "logged_in_user";
}