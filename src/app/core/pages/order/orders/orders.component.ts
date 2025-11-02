import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { collection, collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
   orders$!: Observable<any[]>;

  constructor(private firestore: Firestore, private router: Router) {}

  ngOnInit() {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, orderBy('date', 'desc'));
    this.orders$ = collectionData(q, { idField: 'id' });
  }

  goBack() {
    this.router.navigate(['/store']);
  }

}
