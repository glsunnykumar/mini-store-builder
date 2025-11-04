import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.orderCollection = collection(this.firestore, 'orders');
  }

  /** Get all orders from Firestore */
  async getAllOrders(): Promise<any[]> {
    const snapshot = await getDocs(this.orderCollection);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  }

  /** Add new order */
  async addOrder(orderData: any) {
    return await addDoc(this.orderCollection, orderData);
  }

  /** Update order status or data */
  async updateOrder(orderId: string, updatedData: any) {
    const orderRef = doc(this.firestore, 'orders', orderId);
    await updateDoc(orderRef, updatedData);
  }

  /** Delete order */
  async deleteOrder(orderId: string) {
    const orderRef = doc(this.firestore, 'orders', orderId);
    await deleteDoc(orderRef);
  }

  /** Get single order by ID */
  async getOrderById(orderId: string): Promise<any> {
    const orderRef = doc(this.firestore, 'orders', orderId);
    const snapshot = await getDocs(this.orderCollection);
    const docSnap = snapshot.docs.find((d) => d.id === orderId);
    return docSnap ? { id: docSnap.id, ...docSnap.data() } : null;
  }
}
