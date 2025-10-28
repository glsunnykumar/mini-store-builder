import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/login/login.component';
import { SignupComponent } from './core/pages/signup/signup.component';
import { StoreComponent } from './core/pages/store/store.component';
import { DashboardComponent } from './core/pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'store', component: StoreComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./core/pages/dashboard/dashboard-home.component').then(
            (m) => m.DashboardHomeComponent
          ),
      },
      {
        path: 'category',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./core/pages/category-list/category-list.component').then(
                (m) => m.CategoryListComponent
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                './core/pages/category/category-detail/category-detail.component'
              ).then((m) => m.CategoryDetailComponent),
          },
        ],
      },
      {
        path: 'product',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./core/pages/product/product-list/product-list.component').then(
                (m) => m.ProductListComponent
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                './core/pages/category/category-detail/category-detail.component'
              ).then((m) => m.CategoryDetailComponent),
          },
        ],
      },

      // {
      //   path: 'orders',
      //   loadComponent: () =>
      //     import('./core/pages/orders/orders.component').then(
      //       (m) => m.OrdersComponent
      //     ),
      // },
      // {
      //   path: 'profile',
      //   loadComponent: () =>
      //     import('./core/pages/profile/profile.component').then(
      //       (m) => m.ProfileComponent
      //     ),
      // },
    ],
  },
];
