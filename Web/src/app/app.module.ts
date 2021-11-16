import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AlertComponent } from './alert/alert.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CategoryComponent } from './admin/category/category.component';
import { ProfileComponent } from './profile/profile.component';
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './register/register.component';
import { ProductsComponent } from './products/products.component';
import { ServicesComponent } from './services/services.component';
import { ProductComponent } from './admin/product/product.component';
import { PaymentComponent } from './payment/payment.component';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BannerComponent } from './admin/banner/banner.component';
import { CartComponent } from './cart/cart.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxImageCompressService} from 'ngx-image-compress';
import {DirectPayIpgModule} from 'ng-direct-pay-ipg';
import { OrderComponent } from './admin/order/order.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    AlertComponent,
    CategoryComponent,
    ProfileComponent,
    LandingComponent,
    RegisterComponent,
    ProductsComponent,
    ServicesComponent,
    ProductComponent,
    PaymentComponent,
    BannerComponent,
    CartComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    CommonModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxPaginationModule,
    DirectPayIpgModule.forRoot({size: 200,colour: 'gray'})
  ],
  entryComponents: [],
  providers: [BsDatepickerConfig,NgxImageCompressService],
  bootstrap: [AppComponent]
})
export class AppModule { }
