import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/login/login.component';
import { SignupComponent } from './core/pages/signup/signup.component';
import { DashboardComponent } from './core/pages/dashboard/dashboard.component';
import { StoreComponent } from './core/pages/store/store.component';
import { canActivate } from '@angular/fire/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    //...canActivate(() => ['loggedIn']),
  },
  { path: 'store/:id', component: StoreComponent },
  { path: '**', redirectTo: 'login' },
];
