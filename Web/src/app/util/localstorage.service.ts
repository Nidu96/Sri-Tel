import { Injectable } from "../../../node_modules/@angular/core";

@Injectable({providedIn: 'root'})
export class LocalStorage {
    constructor(){}
    public static LOGGED_USER: string = "logged_in_user";

    public static LANDING_BODY: string = "landing_body";

    public static PRODUCT_PRICE: string = "price";

    public static PRODUCT_ID: string = "product_id";

    public static PRODUCT_NAME: string = "product_name";

    public static SHOPPING_CART: string = "selected_products_array";
}