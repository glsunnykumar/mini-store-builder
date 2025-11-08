import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { Product, ProductService } from '../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import {CommonModule, TitleCasePipe} from '@angular/common';
import { CategoryService } from '../../services/category/category.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from '../../services/cart/cart.service';
import { CartDialogComponent } from '../cart/cart-dialog/cart-dialog.component';

@Component({
  selector: 'app-store',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent {
  categories: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedCategoryId: string | null = null;
  loading = false;
    searchQuery = '';
  cartCount = 0; // ✅ will integrate later with local storage

    constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
     private dialog: MatDialog,
    private cartService: CartService,
      private router :Router
  ) {}

   async ngOnInit() {
    this.loading = true;
    await this.loadCategories();
    await this.loadProducts();
     this.cartService.cart$.subscribe(() => {
    this.cartCount = this.cartService.getCartCount();
  });
    this.loading = false;
  }

  async loadCategories() {
    this.categories = await firstValueFrom(this.categoryService.getCategories());
  }

  async loadProducts() {
    this.products = await this.productService.getAllProducts();
    this.filteredProducts = this.products;
    console.log('Available product is', this.filteredProducts);
  }

    filterByCategory(catId: string | null) {
    this.selectedCategoryId = catId;
    this.filteredProducts = catId
      ? this.products.filter(p => p.categoryId === catId)
      : this.products;
  }


   /** ✅ Filter based on search + category */
  onSearchChange() {
    this.applyFilters();
  }

  private applyFilters() {
    const query = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter((p) => {
      const matchesCategory = this.selectedCategoryId ? p.categoryId === this.selectedCategoryId : true;
      const matchesSearch = p.name?.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }



  openProductDetail(product: any) {
   this.router.navigate(['/product', product.id]);
}

  openCart() {
  console.log('cart is opening');
  this.dialog.open(CartDialogComponent, {
    width: '500px',
    maxWidth: '95vw',
    panelClass: 'cart-dialog',
     autoFocus: false,
      restoreFocus: false,
  });
}


}
