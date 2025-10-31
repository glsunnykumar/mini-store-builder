import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { Product, ProductService } from '../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import {CommonModule, TitleCasePipe} from '@angular/common';
import { CategoryService } from '../../services/category/category.service';
import { firstValueFrom } from 'rxjs';

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
    TitleCasePipe
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

    constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

   async ngOnInit() {
    this.loading = true;
    await this.loadCategories();
    await this.loadProducts();
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


}
