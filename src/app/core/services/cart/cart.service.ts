import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  categoryId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'app_cart';
  private cartSubject = new BehaviorSubject<any[]>(this.loadCart());
  cart$ = this.cartSubject.asObservable(); // ✅ expose observable


/** ✅ Load cart from localStorage */
  private loadCart(): any[] {
    const stored = localStorage.getItem(this.cartKey);
    return stored ? JSON.parse(stored) : [];
  }

  /** ✅ Save cart and notify subscribers */
  private saveCart(cart: any[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  /** ✅ Get current cart items (non-reactive) */
  getItems(): any[] {
    return this.cartSubject.value;
  }

  /** ✅ Add a product to the cart */
  addToCart(product: any) {
    const currentCart = this.getItems();
    const existing = currentCart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }

    this.saveCart(currentCart);
  }

  /** ✅ Remove a product from the cart */
  removeFromCart(productId: string) {
    const updated = this.getItems().filter((item) => item.id !== productId);
    this.saveCart(updated);
  }

  /** ✅ Clear the entire cart */
  clearCart() {
    this.saveCart([]);
  }

  /** ✅ Get total number of items */
  getCartCount(): number {
    return this.getItems().reduce((count, item) => count + (item.quantity || 1), 0);
  }

  /** ✅ Calculate total price */
  getCartTotal(): number {
    return this.getItems().reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  }


}
