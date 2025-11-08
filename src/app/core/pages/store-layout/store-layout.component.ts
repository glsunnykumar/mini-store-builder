import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreNavbarComponent } from '../store-navbar/store-navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-store-layout',
   imports: [RouterOutlet,
     StoreNavbarComponent,
     MatIconModule
    ],
  templateUrl: './store-layout.component.html',
  styleUrl: './store-layout.component.scss'
})
export class StoreLayoutComponent {

   currentYear = new Date().getFullYear();
    cartCount = 0;

   lastScrollTop = 0;
   hideFooter = false;


     constructor(private cartService: CartService) {}

     ngOnInit() {
    // ✅ Subscribe to cart changes
    this.cartService.cart$.subscribe((items) => {
      this.cartCount = items.length;
    });
  }

    /** Detect user scroll direction */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > this.lastScrollTop + 20) {
      // User scrolled down
      this.hideFooter = true;
    } else if (st < this.lastScrollTop - 20) {
      // User scrolled up
      this.hideFooter = false;
    }
    this.lastScrollTop = st <= 0 ? 0 : st;
  }

}
