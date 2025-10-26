import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-category-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss',
})
export class CategoryDetailComponent {
  categoryId!: string;
  category: any;
  editMode = false;
  categoryForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      coverImage: [''],
    });
  }

  async ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id')!;
    this.loadCategory();
  }

  async loadCategory() {
    const catDoc = await this.categoryService.getCategoryById(this.categoryId);
    if (catDoc) {
      this.category = catDoc;
      this.categoryForm.patchValue(catDoc);
    }
  }

  enableEdit() {
    this.editMode = true;
  }

  async saveChanges() {
    if (this.categoryForm.invalid) return;

    const updatedData = this.categoryForm.value;
    await this.categoryService.updateCategory(this.categoryId, updatedData);
    this.snackBar.open('Category updated successfully!', 'Close', {
      duration: 2000,
    });
    this.editMode = false;
    this.loadCategory();
  }

  async deleteCategory() {
    const confirmDelete = confirm(
      'Are you sure you want to delete this category?'
    );
    if (confirmDelete) {
      await this.categoryService.deleteCategory(this.categoryId);
      this.snackBar.open('Category deleted successfully!', 'Close', {
        duration: 2000,
      });
      this.router.navigate(['/dashboard/products']);
    }
  }
}
