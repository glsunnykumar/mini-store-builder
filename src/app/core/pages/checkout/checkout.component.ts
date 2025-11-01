import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart/cart.service';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-checkout',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cartItems: any[] = [];
  total = 0;

  customer = {
    name: '',
    phone: '',
    address: '',
    pincode: '',
  };

  loading = false;
  success = false;

  constructor(
    private cartService: CartService,
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
    this.total = this.cartService.getCartTotal();
  }

  async placeOrder() {
    if (!this.customer.name || !this.customer.phone || !this.customer.address) {
      alert('Please fill all required fields.');
      return;
    }

    this.loading = true;
    try {
      const orderData = {
        customer: this.customer,
        items: this.cartItems,
        total: this.total,
        date: new Date(),
        status: 'Pending',
      };

      const docRef = await addDoc(
        collection(this.firestore, 'orders'),
        orderData
      );

      this.success = true;
      this.cartService.clearCart();

      setTimeout(() => {
        this.router.navigate(['/order-success'], {
          queryParams: { id: docRef.id, total: this.total },
        });
      }, 1000);
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      this.loading = false;
    }
  }
}
