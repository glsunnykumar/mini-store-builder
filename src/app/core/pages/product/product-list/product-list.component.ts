import { Component, inject } from '@angular/core';
import { GlobalLoaderComponent } from "../../../shared/global-loader/global-loader.component";
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { collectionData ,Firestore,collection } from '@angular/fire/firestore';
import { AddProductDialogComponent } from '../product-add/add-product-dialog/add-product-dialog.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [
    GlobalLoaderComponent,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    RouterModule
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
        console.log(this.products);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;
      }
    });
  }


  openEditDialog(productId: string) {
  const dialogRef = this.dialog.open(AddProductDialogComponent, {
    width: '600px',
    maxHeight: '90vh',
    data: { productId }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadProducts(); // refresh list
    }
  });
}

   /** 🔹 Open Add Product Dialog */
  openAddProductDialog(productId?: string) {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '500px',
      maxHeight :'90vh',
      data: { productId: productId || null },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.loadProducts(); // refresh list after new product added
      }
    });
  }

}
