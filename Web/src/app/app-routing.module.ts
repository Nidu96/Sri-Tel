import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CategoryComponent } from './admin/category/category.component';
import { ProfileComponent } from './profile/profile.component';
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './register/register.component';
import { ProductsComponent } from './products/products.component';
import { ServicesComponent } from './services/services.component';
import { ProductComponent } from './admin/product/product.component';
import { PaymentComponent } from './payment/payment.component';
import { BannerComponent } from './admin/banner/banner.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './admin/order/order.component';
import { AboutComponent } from './about/about.component';
import { ContactusComponent } from './contactus/contactus.component';
import { TermsComponent } from './terms/terms.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { allowed: false } },
  { path: 'register', component: RegisterComponent, data: { allowed: false } },

  //home
  { path: '', component: LandingComponent, data: { allowed: false } },
  { path: 'products', component: ProductsComponent, data: { allowed: false } },
  { path: 'services', component: ServicesComponent, data: { allowed: false } },
  { path: 'about', component: AboutComponent, data: { allowed: false } },
  { path: 'contactus', component: ContactusComponent, data: { allowed: false } },
  { path: 'terms', component: TermsComponent, data: { allowed: false } },
  { path: 'payment', component: PaymentComponent, data: { allowed: false } },
  { path: 'cart', component: CartComponent, data: { allowed: false } },

  //admin
  { path: 'dashboard', component: DashboardComponent, data: { allowed: false } },
  { path: 'order', component: OrderComponent, data: { allowed: false } },
  { path: 'category', component: CategoryComponent, data: { allowed: false } },
  { path: 'product', component: ProductComponent, data: { allowed: false } },
  { path: 'order', component: ProductComponent, data: { allowed: false } },
  { path: 'banner', component: BannerComponent, data: { allowed: false } },

  { path: 'profile', component: ProfileComponent, data: { allowed: false } },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
