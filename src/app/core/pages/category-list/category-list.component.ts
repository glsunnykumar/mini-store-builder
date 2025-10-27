import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category/category.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { GlobalLoaderComponent } from "../../shared/global-loader/global-loader.component";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-category-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
    GlobalLoaderComponent
],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent {
  categories: any[] = [];
  loading = true;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((res) => {
      this.categories = res;
      this.loading = false;
    });
  }

  openAddCategoryDialog() {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadCategories();
    });
  }
}
