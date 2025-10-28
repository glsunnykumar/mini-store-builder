import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, serverTimestamp, updateDoc } from '@angular/fire/firestore';
import { deleteObject, getDownloadURL, uploadBytes ,ref , Storage} from '@angular/fire/storage';
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
  private storage = inject(Storage);

  /** 🟢 Fetch all products */
  getProducts(): Observable<any[]> {
    const productsRef = collection(this.firestore, 'products');
    return collectionData(productsRef, { idField: 'id' }) as Observable<any[]>;
  }

  /** 🟢 Add product with image upload */
  async addProduct(productData: any, imageFile?: File) {
    let imageUrl = '';

    if (imageFile) {
      const filePath = `products/${Date.now()}_${imageFile.name}`;
      const storageRef = ref(this.storage, filePath);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    const productsRef = collection(this.firestore, 'products');
    const productDoc = {
      ...productData,
      coverImage: imageUrl,
      createdAt: serverTimestamp(),
    };

    return await addDoc(productsRef, productDoc);
  }

  /** 🟢 Update product */
  async updateProduct(productId: string, updatedData: any) {
    const productRef = doc(this.firestore, `products/${productId}`);
    await updateDoc(productRef, updatedData);
  }

  /** 🔴 Delete product (and optional image) */
  async deleteProduct(productId: string, imageUrl?: string) {
    if (imageUrl) {
      const storageRef = ref(this.storage, imageUrl);
      await deleteObject(storageRef).catch(() => console.warn('Image not found in storage'));
    }
    const productRef = doc(this.firestore, `products/${productId}`);
    await deleteDoc(productRef);
  }
}
