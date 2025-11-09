import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReviewService } from '../../services/review/review.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, 
    MatCardModule,
     MatButtonModule, 
     MatIconModule ,
     MatProgressSpinnerModule
    ],
  templateUrl: './admin-reviews.component.html',
  styleUrls: ['./admin-reviews.component.scss'],
})
export class AdminReviewsComponent implements OnInit {
  pendingReviews: any[] = [];
  loading = false;

  constructor(private reviewService: ReviewService) {}

  async ngOnInit() {
    await this.loadPendingReviews();
  }

  async loadPendingReviews() {
    this.loading = true;
    this.pendingReviews = await this.reviewService.getPendingReviews();
    this.loading = false;
  }

  async approve(review: any) {
    await this.reviewService.approveReview(review.id, review.productId);
    this.pendingReviews = this.pendingReviews.filter((r) => r.id !== review.id);
  }

  async reject(review: any) {
    await this.reviewService.rejectReview(review.id);
    this.pendingReviews = this.pendingReviews.filter((r) => r.id !== review.id);
  }
}
