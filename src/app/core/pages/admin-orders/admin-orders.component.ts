import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { collection, collectionData, doc, Firestore, orderBy, query, updateDoc } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-orders',
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent {
  orders$!: Observable<any[]>;
  statuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

  constructor(private firestore: Firestore) {}

   ngOnInit() {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, orderBy('date', 'desc'));
    this.orders$ = collectionData(q, { idField: 'id' });
  }

  async updateStatus(orderId: string, newStatus: string) {
    try {
      const orderDoc = doc(this.firestore, 'orders', orderId);
      await updateDoc(orderDoc, { status: newStatus });
      console.log(`Order ${orderId} updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  }

}
