import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, serverTimestamp, updateDoc, getDoc, getDocs, where, query } from '@angular/fire/firestore';
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


   /** ➕ Add Product */
  async addProduct(productData: any) {
    const refCollection = collection(this.firestore, 'products');
    productData.createdAt = new Date();
    await addDoc(refCollection, productData);
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

  async getProductsByCategory(categoryId: string) {
  const q = query(
    collection(this.firestore, 'products'),
    where('categoryId', '==', categoryId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

 
    /** ✏️ Update Product (with or without new images) */
  async updateProduct(productId: string, productData: any, files: File[] = []) {
    const docRef = doc(this.firestore, `products/${productId}`);

    let updatedImages = productData.images || [];

    // If new files are provided, upload them and append to the array
    if (files && files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const filePath = `products/${Date.now()}_${file.name}`;
        const fileRef = ref(this.storage, filePath);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
      });

      const newImageUrls = await Promise.all(uploadPromises);
      updatedImages = [...updatedImages, ...newImageUrls];
    }

    // Update Firestore document
    await updateDoc(docRef, {
      ...productData,
      images: updatedImages,
      updatedAt: new Date(),
    });
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
