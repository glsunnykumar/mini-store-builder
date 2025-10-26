import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    RouterModule,
  ],

  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
})
export class DashboardHomeComponent {

   displayedColumns: string[] = ['id', 'customer', 'total', 'status'];
  orders = [
    { id: 'ORD001', customer: 'John Doe', total: 1250, status: 'Pending' },
    { id: 'ORD002', customer: 'Jane Smith', total: 980, status: 'Delivered' },
    { id: 'ORD003', customer: 'Michael Lee', total: 2100, status: 'Shipped' },
  ];
}
