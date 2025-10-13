import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private firestore = inject(Firestore);
  private collectionRef = collection(this.firestore, 'products');

  addProduct(product: Product) {
    return addDoc(this.collectionRef, product);
  }

  getProducts(): Observable<Product[]> {
    return collectionData(this.collectionRef, { idField: 'id' }) as Observable<Product[]>;
  }

  deleteProduct(id: string) {
    const docRef = doc(this.firestore, `products/${id}`);
    return deleteDoc(docRef);
  }
}
