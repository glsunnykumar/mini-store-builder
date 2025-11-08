import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/login/login.component';
import { SignupComponent } from './core/pages/signup/signup.component';
import { DashboardComponent } from './core/pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { StoreLayoutComponent } from './core/pages/store-layout/store-layout.component';

export const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: 'store', pathMatch: 'full' },

  // Authentication
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // 🏪 Public Store Layout (includes navbar automatically)
  {
    path: '',
    component: StoreLayoutComponent,
    children: [
      {
        path: 'store',
        loadComponent: () =>
          import('./core/pages/store/store.component').then(
            (m) => m.StoreComponent
          ),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./core/pages/checkout/checkout.component').then(
            (m) => m.CheckoutComponent
          ),
      },
      {
        path: 'order-success',
        loadComponent: () =>
          import(
            './core/pages/cart/order-success/order-success.component'
          ).then((m) => m.OrderSuccessComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./core/pages/order/orders/orders.component').then(
            (m) => m.OrdersComponent
          ),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import(
            './core/pages/product/product-detail/product-detail.component'
          ).then((m) => m.ProductDetailComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./core/pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
    ],
  },

  // 🧑‍💼 Admin Dashboard Section
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
        path: 'users',
        loadComponent: () =>
          import('./core/pages/admin-users/admin-users.component').then(
            (m) => m.AdminUsersComponent
          ),
      },
      {
        path: 'product',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './core/pages/product/product-list/product-list.component'
              ).then((m) => m.ProductListComponent),
          },
          // Uncomment later if editing in dialog route form:
          // {
          //   path: ':id',
          //   loadComponent: () =>
          //     import('./core/pages/product/product-add/add-product-dialog/add-product-dialog.component').then(
          //       (m) => m.AddProductDialogComponent
          //     ),
          // },
        ],
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./core/pages/admin-orders/admin-orders.component').then(
            (m) => m.AdminOrdersComponent
          ),
      },
    ],
  },

  // Fallback 404 (optional)
  {
    path: '**',
    redirectTo: 'store',
  },
];
