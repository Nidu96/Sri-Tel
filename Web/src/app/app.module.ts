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
import { ProfileComponent } from './profile/profile.component';
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './register/register.component';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BannerComponent } from './admin/banner/banner.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxImageCompressService} from 'ngx-image-compress';
import {DirectPayIpgModule} from 'ng-direct-pay-ipg';
import { AboutComponent } from './about/about.component';
import { ContactusComponent } from './contactus/contactus.component';
import { FactorsComponent } from './factors/factors.component';
import { AnalysisHistoryComponent } from './analysis-history/analysis-history.component';
import { RiskAnalysisComponent } from './risk-analysis/risk-analysis.component';

import { ChartModule } from 'angular-highcharts';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    AlertComponent,
    ProfileComponent,
    LandingComponent,
    RegisterComponent,
    FactorsComponent,
    BannerComponent,
    AboutComponent,
    ContactusComponent,
    AnalysisHistoryComponent,
    RiskAnalysisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    CommonModule,
    ChartModule,
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
