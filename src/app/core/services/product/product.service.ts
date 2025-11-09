import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, serverTimestamp, updateDoc, getDoc, getDocs } from '@angular/fire/firestore';
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


    async addProduct(productData: any, file: File | null) {
    let imageUrl = '';

    if (file) {
      const filePath = `products/${Date.now()}_${file.name}`;
      const fileRef = ref(this.storage, filePath);
      await uploadBytes(fileRef, file);
      imageUrl = await getDownloadURL(fileRef);
    }

    const productRef = collection(this.firestore, 'products');
    await addDoc(productRef, { ...productData, imageUrl, createdAt: new Date() });
  }

   /** ✅ Get all products (used in Store & Admin Dashboard) */
  async getAllProducts() {
    const snapshot = await getDocs(collection(this.firestore, 'products'));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  /** 🟢 Fetch all products */
  getProducts(): Observable<any[]> {
    const productsRef = collection(this.firestore, 'products');
    return collectionData(productsRef, { idField: 'id' }) as Observable<any[]>;
  }

 
  async updateProduct(productId: string, productData: any, file: File | null) {
    const docRef = doc(this.firestore, `products/${productId}`);

    let imageUrl = productData.imageUrl;

    if (file) {
      const filePath = `products/${Date.now()}_${file.name}`;
      const fileRef = ref(this.storage, filePath);
      await uploadBytes(fileRef, file);
      imageUrl = await getDownloadURL(fileRef);
    }

    await updateDoc(docRef, { ...productData, imageUrl, updatedAt: new Date() });
  }

  async getProductById(productId: string) {
    const docRef = doc(this.firestore, `products/${productId}`);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  }

  async getProductIdById(productId: string) {
  const docRef = doc(this.firestore, `products/${productId}`);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
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
