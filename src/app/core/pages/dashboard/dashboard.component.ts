import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'pending' | 'delivered' | 'cancelled';
}

@Component({
  selector: 'app-dashboard',
  imports: [
      CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
   sidebarOpen = true;
 displayedColumns: string[] = ['id', 'customer', 'total', 'status'];

  orders: Order[] = [
    { id: 'ORD-1001', customer: 'Ravi Sharma', total: 2500, status: 'pending' },
    { id: 'ORD-1002', customer: 'Sneha Patel', total: 1800, status: 'delivered' },
    { id: 'ORD-1003', customer: 'Amit Verma', total: 3500, status: 'cancelled' },
  ];

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }


delete(id:any){
  
}

}
