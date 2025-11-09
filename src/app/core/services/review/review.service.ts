import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
} from '@angular/fire/firestore';
import { limit } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private firestore: Firestore) {}

  /** ➕ Add new review (awaiting approval) */
  async addReview(productId: string, review: any) {
    const reviewData = {
      ...review,
      productId,
      approved: false,
      createdAt: new Date(),
    };

    // Add under product → reviews
    const productRef = collection(this.firestore, `products/${productId}/reviews`);
    await addDoc(productRef, reviewData);

    // Duplicate in root reviews (for admin panel)
    const globalRef = collection(this.firestore, 'reviews');
    await addDoc(globalRef, reviewData);
  }

/** 🔍 Fetch approved reviews for a specific product (from root `reviews` collection) */
async getApprovedReviews(productId: string) {
  const ref = collection(this.firestore, 'reviews');
  const q = query(
    ref,
    where('productId', '==', productId),
    where('approved', '==', true),
    orderBy('createdAt', 'desc'),
    limit(5)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}


  /** 🔍 Fetch all pending reviews for admin */
  async getPendingReviews() {
    const ref = collection(this.firestore, 'reviews');
    const q = query(ref, where('approved', '==', false), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  /** ✅ Approve review */
  async approveReview(reviewId: string, productId: string) {
    const reviewRef = doc(this.firestore, `reviews/${reviewId}`);
    await updateDoc(reviewRef, { approved: true });

    const productReviewRef = doc(this.firestore, `products/${productId}/reviews/${reviewId}`);
    try {
      await updateDoc(productReviewRef, { approved: true });
    } catch (err) {
      console.warn('Review subdocument may not exist yet:', err);
    }
  }

  /** ❌ Reject / Delete review */
  async rejectReview(reviewId: string) {
    const reviewRef = doc(this.firestore, `reviews/${reviewId}`);
    await updateDoc(reviewRef, { approved: false });
  }
}
