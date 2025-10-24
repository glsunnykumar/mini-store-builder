import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/login/login.component';
import { SignupComponent } from './core/pages/signup/signup.component';
import { DashboardComponent } from './core/pages/dashboard/dashboard.component';
import { StoreComponent } from './core/pages/store/store.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
   { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
  path: 'products',
  loadComponent: () => import('./core/pages/category-list/category-list.component').then(m => m.CategoryListComponent)
},
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'store', component: StoreComponent },
];
