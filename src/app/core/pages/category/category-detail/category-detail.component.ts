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
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';

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
    MatSnackBarModule,
  ],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss',
})
export class CategoryDetailComponent {
categoryId!: string;
  category: any;
  editMode = false;
  newImageFile: File | null = null;
  uploadInProgress = false;
  categoryForm: FormGroup;
   newImagePreview: string | ArrayBuffer | null = null;

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

    onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newImageFile = file;
      
      // 🔥 Generate a local preview
      const reader = new FileReader();
      reader.onload = () => {
        this.newImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  async saveChanges() {
    
    if (this.categoryForm.invalid) return;
    this.uploadInProgress = true;

    let updatedData = this.categoryForm.value;

    // Upload new image if changed
    if (this.newImageFile) {
      const storage = getStorage();
      const imagePath = `category/${Date.now()}_${this.newImageFile.name}`;
      const imageRef = ref(storage, imagePath);

      // Delete old image if exists
      if (this.category?.coverImage) {
        try {
          const oldRef = ref(storage, this.category.coverImage);
          await deleteObject(oldRef);
        } catch (err) {
          console.warn('Old image deletion skipped (not found)');
        }
      }

      await uploadBytes(imageRef, this.newImageFile);
      const downloadURL = await getDownloadURL(imageRef);
      updatedData.coverImage = downloadURL;
    }



    await this.categoryService.updateCategory(this.categoryId, updatedData);
    this.snackBar.open('Category updated successfully!', 'Close', {
      duration: 2000,
    });
    this.uploadInProgress = false;
    this.editMode = false;
    await this.loadCategory();
  }

  async deleteCategory() {
    const confirmDelete = confirm(
      'Are you sure you want to delete this category?'
    );
    if (confirmDelete) {

       // Delete image from storage
      if (this.category?.coverImage) {
        try {
          const storage = getStorage();
          const imageRef = ref(storage, this.category.coverImage);
          await deleteObject(imageRef);
        } catch (err) {
          console.warn('Could not delete image from storage');
        }
      }

      await this.categoryService.deleteCategory(this.categoryId);
      this.snackBar.open('Category deleted successfully!', 'Close', {
        duration: 2000,
      });
      this.router.navigate(['/dashboard/products']);
    }
  }
}
