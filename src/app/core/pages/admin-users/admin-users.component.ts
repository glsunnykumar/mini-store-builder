import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatDialog } from '@angular/material/dialog';
import { UserDetailDialogComponent } from './user-detail-dialog/user-detail-dialog.component';

interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinner
],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  displayedUsers: User[] = [];
  displayedColumns = ['photo', 'name', 'email', 'actions'];
  searchQuery = '';
  loading = true;

  constructor(private firestore: Firestore ,  private dialog: MatDialog) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  /** 🔹 Load all users from Firestore */
  async loadUsers() {
    const snapshot = await getDocs(collection(this.firestore, 'users'));
    this.users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
    this.displayedUsers = [...this.users];
    this.loading = false;
  }

  openUserDetails(user: any) {
  this.dialog.open(UserDetailDialogComponent, {
    width: '420px',
    data: user,
  });
}

  /** 🔍 Search user by name or email */
  onSearchChange() {
    const query = this.searchQuery.toLowerCase();
    this.displayedUsers = this.users.filter(
      (u) =>
        u.displayName?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query)
    );
  }
}
