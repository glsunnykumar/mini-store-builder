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
 private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  products: Product[] = [];
  storeName = '';

  ngOnInit() {
    const storeId = this.route.snapshot.paramMap.get('id')!;
    this.storeName = storeId;
    this.productService.getProducts().subscribe(res => {
      this.products = res;
    });
  }
}
