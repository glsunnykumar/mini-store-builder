import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../../services/cart/cart.service';

@Component({
  selector: 'app-product-detail-dialog',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './product-detail-dialog.component.html',
  styleUrl: './product-detail-dialog.component.scss'
})
export class ProductDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public product: any,
     private cartService: CartService
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  addToCart() {
  this.cartService.addToCart(this.product);
  this.dialogRef.close();
}



}
