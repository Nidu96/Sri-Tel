import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AccessControlComponent } from './admin/access-control/access-control.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  { path: '', component: LoginComponent, data: { allowed: false } },
  { path: 'dashboard', component: DashboardComponent, data: { allowed: false } },
  { path: 'access-control', component: AccessControlComponent, data: { allowed: false } },
  { path: 'profile', component: ProfileComponent, data: { allowed: false } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
