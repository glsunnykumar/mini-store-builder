import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';// 🔹 check login state
import { CartService } from '../../../services/cart/cart.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ProductService } from '../../../services/product/product.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, 
    MatButtonModule,
     FormsModule, 
     RouterModule,
     MatProgressSpinnerModule
    ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
   product: any;
  loading = true;

  selectedImage = '';
  stars = [1, 2, 3, 4, 5];

  user: any = null;
  newReview = { rating: 0, comment: '', name: '' };

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private router: Router,
     private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  async ngOnInit() {
    console.log(this.product);
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.product = await this.productService.getProductById(id);
      this.loading = false;
      console.log('loaded product is',this.product);
    }
    this.selectedImage = this.product?.images?.[0] || '';

    // 🔹 Check current logged in user
    this.auth.user$.subscribe((user) => {
      this.user = user;
      this.newReview.name = user?.displayName || 'Anonymous';
    });
  }
    
  

  selectImage(img: string) {
    this.selectedImage = img;
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }

  setRating(star: number) {
    this.newReview.rating = star;
  }

  resetReview() {
    this.newReview = { rating: 0, comment: '', name: this.user?.displayName || 'Anonymous' };
  }

  /** 🔐 Submit review only if logged in */
  submitReview() {
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.newReview.comment || this.newReview.rating === 0) return;

    if (!this.product.reviews) this.product.reviews = [];
    this.product.reviews.push({
      ...this.newReview,
      date: new Date().toISOString(),
      userId: this.user.uid,
    });

    // Reset form
    this.resetReview();
  }
}
