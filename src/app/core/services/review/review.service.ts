import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  doc,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private firestore: Firestore) {}

  /** ➕ Add new review (pending admin approval) */
  async addReview(productId: string, review: any) {
    const ref = collection(this.firestore, `products/${productId}/reviews`);
    await addDoc(ref, {
      ...review,
      approved: false,
      createdAt: new Date(),
    });
  }

  /** 🔍 Get all approved reviews for public view */
  async getApprovedReviews(productId: string) {
    const ref = collection(this.firestore, `products/${productId}/reviews`);
    const q = query(ref, where('approved', '==', true), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  /** 🛠️ Admin approves review */
  async approveReview(productId: string, reviewId: string) {
    const reviewRef = doc(this.firestore, `products/${productId}/reviews/${reviewId}`);
    await updateDoc(reviewRef, { approved: true });
  }

  /** ❌ Admin deletes or rejects review */
  async deleteReview(productId: string, reviewId: string) {
    const reviewRef = doc(this.firestore, `products/${productId}/reviews/${reviewId}`);
    await updateDoc(reviewRef, { approved: false });
  }
}
