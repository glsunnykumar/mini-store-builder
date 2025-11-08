import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-store-navbar',
   imports: [CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    FormsModule,
     RouterModule,
     MatTooltipModule,
     MatMenuModule,
     MatDividerModule
    ],
  templateUrl: './store-navbar.component.html',
  styleUrl: './store-navbar.component.scss'
})
export class StoreNavbarComponent {
 /** 🔍 Two-way binding for search */
  @Input() searchQuery: string = '';
    /** 🛒 Cart count (passed from parent) */
  @Input() cartCount: number = 0;
  @Output() searchChange = new EventEmitter<string>();
   @Output() openCartEvent = new EventEmitter<void>();

  isLoggedIn = false;
  userEmail: string | null = null;


   constructor(private router: Router, private auth: Auth) {}

     ngOnInit() {
    // ✅ Track Firebase auth state
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
        this.userEmail = user.email;
      } else {
        this.isLoggedIn = false;
        this.userEmail = null;
      }
    });
  }
  /** Emit search text changes */
  onSearchChange() {
    this.searchChange.emit(this.searchQuery);
  }

  /** Trigger open cart dialog */
  openCart() {
    this.openCartEvent.emit();
  }

   async handleAuthAction() {
    if (this.isLoggedIn) {
      // 🔹 If logged in → logout
      await signOut(this.auth);
      this.router.navigate(['/store']);
    } else {
      // 🔹 If not logged in → go to login page
      this.router.navigate(['/login']);
    }
  }

   async logout() {
    await signOut(this.auth);
    this.router.navigate(['/store']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

}
