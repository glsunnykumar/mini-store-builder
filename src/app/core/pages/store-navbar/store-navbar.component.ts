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
import { AuthService } from '../../services/auth/auth.service';

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

  displayName: string | null = null;
  photoURL: string | null = null;
  email: string | null = null;
  isLoggedIn = false;
  userEmail: string | null = null;
  hoverVisible = false;
isMobile = false;


   constructor(private router: Router, private auth: Auth ,private authService: AuthService) {}


   ngOnInit() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
        this.displayName = user.displayName;
        this.photoURL = user.photoURL;
        this.email = user.email;
      } else {
        this.isLoggedIn = false;
        this.displayName = null;
        this.photoURL = null;
        this.email = null;
      }
    });

     // ✅ Detect mobile width
  this.isMobile = window.innerWidth <= 768;
  window.addEventListener('resize', () => {
    this.isMobile = window.innerWidth <= 768;
  });
  }

  /** Emit search text changes */
  onSearchChange() {
    this.searchChange.emit(this.searchQuery);
  }


  /** 👆 For desktop hover */
showHoverCard() {
  if (!this.isMobile) this.hoverVisible = true;
}

/** 👇 Hide card */
hideHoverCard() {
  if (!this.isMobile) this.hoverVisible = false;
}

/** 📱 For mobile tap */
toggleHoverCard() {
  if (this.isMobile) {
    this.hoverVisible = !this.hoverVisible;
    if (this.hoverVisible) {
      setTimeout(() => (this.hoverVisible = false), 3000); // auto-hide after 3s
    }
  }
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
