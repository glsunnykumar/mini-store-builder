import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { collection, collectionData, doc, Firestore, orderBy, query, updateDoc } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { OrderService } from '../../services/order/order.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-orders',
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent {
  
  orders: any[] = [];
  statuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
   filteredOrders: any[] = [];
  selectedStatus: string = '';

  constructor(private firestore: Firestore ,
    private orderService :OrderService
  ) {}

   ngOnInit() {
    this.loadOrders();
  }

    async loadOrders() {
    this.orders = await this.orderService.getAllOrders();
    this.filteredOrders = this.orders;
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

  filterOrders() {
    if (this.selectedStatus) {
      this.filteredOrders = this.orders.filter(
        (order) => order.status.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    } else {
      this.filteredOrders = this.orders;
    }
  }

   filterByBadge(status: string) {
    this.selectedStatus = status.toLowerCase();
    this.filterOrders();
  }

}
