import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../../../../services/product/product.service';
import { CategoryService } from '../../../../services/category/category.service';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { GlobalLoaderComponent } from "../../../../shared/global-loader/global-loader.component";


@Component({
  selector: 'app-add-product-dialog',
  standalone: true,
   imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    GlobalLoaderComponent
],
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss']
})
export class AddProductDialogComponent implements OnInit {
  productForm!: FormGroup;
  categories: any[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isEditMode = false;
  productId: string | null = null;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProductDialogComponent>,
    private productService: ProductService,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit() {
    this.isEditMode = !!this.data?.productId;
    this.productId = this.data?.productId || null;

    // Initialize form
    this.productForm = this.fb.group({
      categoryId: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(1)]],
      imageUrl: ['']
    });

    // Load categories for dropdown
    await this.loadCategories();

    // If productId exists, load existing product
    if (this.isEditMode && this.productId) {
      this.loadProductData(this.productId);
    }
    this.loading = false;
  }

  /** Load all categories from Firestore */
  async loadCategories() {
   this.categories = await firstValueFrom(this.categoryService.getCategories());
  }

  /** Load product by ID and populate form */
  async loadProductData(id: string) {
    try {
      const product = await this.productService.getProductById(id);
      if (product) {
        this.productForm.patchValue({
          categoryId: product['categoryId'],
          name: product['name'],
          description: product['description'],
          price: product['price'],
          imageUrl: product['imageUrl']
        });
        this.imagePreview = product['imageUrl'];
      }
      this.loading = false;
    } catch (error) {
      console.error('Error loading product:', error);
    }
  }

  /** Handle file input */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  /** Save or update product */
  async saveProduct() {
    if (this.productForm.invalid) return;
    this.loading = true;

    const productData = this.productForm.value;

    try {
      if (this.isEditMode && this.productId) {
        // 🧩 Update Product
        await this.productService.updateProduct(this.productId, productData, this.selectedFile);
      } else {
        // ➕ Add New Product
        await this.productService.addProduct(productData, this.selectedFile);
      }

      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      this.loading = false;
    }
  }


  async deleteProduct() {
  if (!this.isEditMode || !this.productId) return;

  const confirmDelete = confirm('Are you sure you want to delete this product?');
  if (!confirmDelete) return;

  try {
    this.loading = true;
    await this.productService.deleteProduct(this.productId);
    alert('Product deleted successfully!');
    this.dialogRef.close(true); // close dialog and refresh list
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Failed to delete product. Please try again.');
  } finally {
    this.loading = false;
  }
}

  cancel(): void {
    this.dialogRef.close(false);
  }
}
