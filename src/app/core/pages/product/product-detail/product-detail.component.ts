import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // 🔹 check login state
import { CartService } from '../../../services/cart/cart.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ProductService } from '../../../services/product/product.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCard, MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatCard
],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit,OnDestroy {

    @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  product: any;
  loading = true;

  selectedImage = '';
  stars = [1, 2, 3, 4, 5];
  user: any = null;
  newReview = { rating: 0, comment: '', name: '' };
   similarProducts: any[] = [];
  averageRating = 0;

   private autoScrollInterval: any;
  private autoScrollPaused = false;

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      console.log(id);
      this.product = await this.productService.getProductIdById(id);
       this.loadSimilarProducts(this.product.categoryId);
      this.loading = false;
      this.calculateAverageRating();
    }
    this.selectedImage = this.product?.images?.[0] || '';

    // 🔹 Check current logged in user
    this.auth.user$.subscribe((user) => {
      this.user = user;
      this.newReview.name = user?.displayName || 'Anonymous';
    });
  }

    async loadSimilarProducts(categoryId: string) {
    const allProducts = await this.productService.getProductsByCategory(categoryId);
    this.similarProducts = allProducts.filter((p: any) => p.id !== this.product.id);
  }

    scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

    /** 🔁 Auto Scroll Functionality */
  startAutoScroll() {
    this.stopAutoScroll(); // prevent duplicates
    this.autoScrollInterval = setInterval(() => {
      if (!this.autoScrollPaused && this.scrollContainer) {
        const container = this.scrollContainer.nativeElement;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;

        // If at end, scroll back to start
        if (container.scrollLeft >= maxScrollLeft - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 250, behavior: 'smooth' });
        }
      }
    }, 4000); // Scroll every 4 seconds
  }

  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  pauseAutoScroll() {
    this.autoScrollPaused = true;
  }

  resumeAutoScroll() {
    this.autoScrollPaused = false;
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }


  /** Star selection */
  setRating(star: number) {
    this.newReview.rating = star;
  }

  resetReview() {
    this.newReview = {
      rating: 0,
      comment: '',
      name: this.user?.displayName || 'Anonymous',
    };
  }

  /** 🔐 Only logged-in user can submit */
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

    this.calculateAverageRating();
    this.resetReview();
  }

  calculateAverageRating() {
    if (!this.product.reviews || this.product.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const total = this.product.reviews.reduce(
      (sum: number, r: any) => sum + (r.rating || 0),
      0
    );
    this.averageRating = total / this.product.reviews.length;
  }
  selectImage(img: string) {
    this.selectedImage = img;
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
    openProduct(product: any) {
    this.router.navigate(['/store/product', product.id]);
  }
}
