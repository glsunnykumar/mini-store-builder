import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-store-navbar',
   imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule, RouterModule],
  templateUrl: './store-navbar.component.html',
  styleUrl: './store-navbar.component.scss'
})
export class StoreNavbarComponent {
 /** 🔍 Two-way binding for search */
  @Input() searchQuery: string = '';
  @Output() searchChange = new EventEmitter<string>();

  /** 🛒 Cart count (passed from parent) */
  @Input() cartCount: number = 0;

  /** Emit search text changes */
  onSearchChange() {
    this.searchChange.emit(this.searchQuery);
  }

  /** Trigger open cart dialog */
  @Output() openCartEvent = new EventEmitter<void>();
  openCart() {
    this.openCartEvent.emit();
  }

}
