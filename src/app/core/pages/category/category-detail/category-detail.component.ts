import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-detail',
   imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss'
})
export class CategoryDetailComponent {
    categoryId!: string;

  constructor(private route: ActivatedRoute) {
    this.categoryId = this.route.snapshot.paramMap.get('id')!;
  }

  deleteCategory() {
    console.log('Delete category', this.categoryId);
    // later you’ll call your Firebase delete logic here
  }

}
