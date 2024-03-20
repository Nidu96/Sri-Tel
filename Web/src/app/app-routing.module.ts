import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './register/register.component';
import { BannerComponent } from './admin/banner/banner.component';
import { AboutComponent } from './about/about.component';
import { ContactusComponent } from './contactus/contactus.component';
import { FactorsComponent } from './factors/factors.component';
import { AnalysisHistoryComponent } from './analysis-history/analysis-history.component';
import { RiskAnalysisComponent } from './risk-analysis/risk-analysis.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { allowed: false } },
  { path: 'register', component: RegisterComponent, data: { allowed: false } },

  //home
  { path: '', component: LandingComponent, data: { allowed: false } },
  { path: 'factors', component: FactorsComponent, data: { allowed: false } },
  { path: 'about', component: AboutComponent, data: { allowed: false } },
  { path: 'contactus', component: ContactusComponent, data: { allowed: false } },

  //admin
  { path: 'dashboard', component: DashboardComponent, data: { allowed: false } },
  { path: 'banner', component: BannerComponent, data: { allowed: false } },

  //user
  { path: 'profile', component: ProfileComponent, data: { allowed: false } },
  { path: 'analysishistory', component: AnalysisHistoryComponent, data: { allowed: false } },
  { path: 'riskanalysis', component: RiskAnalysisComponent, data: { allowed: false } }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
