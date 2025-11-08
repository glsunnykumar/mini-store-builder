import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatCardModule ,MatProgressSpinnerModule],
  templateUrl: './user-detail-dialog.component.html',
  styleUrls: ['./user-detail-dialog.component.scss'],
})
export class UserDetailDialogComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(
    private firestore: Firestore,
    private dialogRef: MatDialogRef<UserDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit() {
    await this.loadOrders();
  }

  async loadOrders() {
    const q = query(collection(this.firestore, 'orders'), where('userId', '==', this.data.id));
    const snapshot = await getDocs(q);
    this.orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    this.loading = false;
  }

  close() {
    this.dialogRef.close();
  }
}
