import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CartItem, CartService } from '../../../services/cart/cart.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-dialog',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './cart-dialog.component.html',
  styleUrl: './cart-dialog.component.scss'
})
export class CartDialogComponent {

   cartItems: CartItem[] = [];
  total = 0;

  constructor(
    private dialogRef: MatDialogRef<CartDialogComponent>,
    private cartService: CartService,
    private router: Router
  ) {
    this.loadCart();
  }

    loadCart() {
    this.cartItems = this.cartService.getItems();
    this.total = this.cartService.getCartTotal();
  }

   increaseQuantity(item: CartItem) {
    item.quantity++;
    this.saveChanges();
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      this.saveChanges();
    }
  }

    removeItem(id: string) {
    this.cartService.removeFromCart(id);
    this.loadCart();
  }

  clearCart() {
    this.cartService.clearCart();
    this.loadCart();
  }

   saveChanges() {
    localStorage.setItem('miniStoreCart', JSON.stringify(this.cartItems));
    this.total = this.cartService.getCartTotal();
  }

  closeDialog() {
    this.dialogRef.close();
  }

    checkout() {
  this.dialogRef.close();
  this.router.navigate(['/checkout']);
  }

}
