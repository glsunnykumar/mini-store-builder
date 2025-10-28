import { Component, inject } from '@angular/core';
import { GlobalLoaderComponent } from "../../../shared/global-loader/global-loader.component";
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { collectionData ,Firestore,collection } from '@angular/fire/firestore';
import { AddProductDialogComponent } from '../product-add/add-product-dialog/add-product-dialog.component';

@Component({
  selector: 'app-product-list',
  imports: [
    GlobalLoaderComponent,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
    private firestore = inject(Firestore);
  private dialog = inject(MatDialog);

  products: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadProducts();
  }

   /** 🔹 Fetch all products from Firestore (global or category-based) */
  loadProducts() {
    const productsRef = collection(this.firestore, 'products'); // or use 'categories/{id}/products' later
    collectionData(productsRef, { idField: 'id' }).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;
      }
    });
  }

   /** 🔹 Open Add Product Dialog */
  openAddProductDialog() {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.loadProducts(); // refresh list after new product added
      }
    });
  }

}
