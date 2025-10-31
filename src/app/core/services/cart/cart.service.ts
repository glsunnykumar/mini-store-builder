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
  private cartKey = 'miniStoreCart';
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }


   /** ✅ Load cart from localStorage */
  private loadCart() {
    const data = localStorage.getItem(this.cartKey);
    if (data) {
      this.cartItems = JSON.parse(data);
      this.cartSubject.next(this.cartItems);
    }
  }

    /** ✅ Save cart to localStorage */
  private saveCart() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

   /** ✅ Add or update item */
  addToCart(product: any) {
    const existing = this.cartItems.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl || product.coverImage,
        categoryId: product.categoryId
      });
    }
    this.saveCart();
  }

    /** ✅ Remove item */
  removeFromCart(id: string) {
    this.cartItems = this.cartItems.filter(i => i.id !== id);
    this.saveCart();
  }

  /** ✅ Clear all items */
  clearCart() {
    this.cartItems = [];
    this.saveCart();
  }

  /** ✅ Get cart count */
  getCartCount(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  /** ✅ Get total price */
  getCartTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  /** ✅ Get all items */
  getItems(): CartItem[] {
    return [...this.cartItems];
  }


}
