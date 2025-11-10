import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { GlobalLoaderComponent } from '../../../../shared/global-loader/global-loader.component';
import {
  getDownloadURL,
  Storage,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule ,
    FormsModule,
    ReactiveFormsModule,
    GlobalLoaderComponent,
  ],
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss'],
})
export class AddProductDialogComponent implements OnInit {
  productForm!: FormGroup;
  categories: any[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  imagePreviews: string[] = [];
  selectedFile: File | null = null;
  isEditMode = false;
  productId: string | null = null;
  loading = true;
  imageDbUrl: string = '';
  selectedFiles: File[] = [];
  coverImageIndex: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProductDialogComponent>,
    private productService: ProductService,
    private categoryService: CategoryService,
    private storage: Storage,
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
      imageUrl: [''],
    });

    // Load categories for dropdown
    await this.loadCategories();

    // If productId exists, load existing product
    if (this.isEditMode && this.productId) {
      await this.loadProductData(this.productId);
    }
    this.loading = false;
  }

  /** Load all categories from Firestore */
  async loadCategories() {
    const list = await firstValueFrom(this.categoryService.getCategories());
    this.categories = list.sort((a, b) => a['name'].localeCompare(b['name']));
  }

  setAsCover(index: number) {
    this.coverImageIndex = index;
  }

  /** Load product by ID and populate form */
  async loadProductData(id: string) {
  try {
    const product = await this.productService.getProductById(id);
    if (product) {
      this.imageDbUrl = product['imageUrl'];
      console.log('Product loaded:', product);

      // ✅ Patch basic product info
      this.productForm.patchValue({
        categoryId: product['categoryId'],
        name: product['name'],
        description: product['description'],
        price: product['price'],
      });

      // ✅ Load all images
      if (Array.isArray(product['images']) && product['images'].length > 0) {
        this.imagePreviews = [...product['images']]; // all uploaded images
      } else if (product['imageUrl']) {
        // fallback for old single-image products
        this.imagePreviews = [product['imageUrl']];
      } else {
        this.imagePreviews = [];
      }

      // ✅ Set cover image (if exists)
      this.coverImageIndex = 0;
      this.imageDbUrl = this.imagePreviews[0] ;
    }

    this.loading = false;
  } catch (error) {
    console.error('Error loading product:', error);
    this.loading = false;
  }
}

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = Array.from(files);

    this.imagePreviews = [];
    this.selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  async uploadImages(): Promise<string[]> {
    const urls: string[] = [];
    for (const file of this.selectedFiles) {
      const filePath = `products/${uuidv4()}_${file.name}`;
      const fileRef = ref(this.storage, filePath);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      urls.push(url);
    }
    return urls;
  }

  async saveProduct() {
    if (this.productForm.invalid) return;

    this.loading = true;
    try {
      const imageUrls = await this.uploadImages();

      const finalImages =
        this.imagePreviews.length > 0
          ? imageUrls
          : this.data?.product?.images || [];

      // ✅ Determine cover image
      const coverImageUrl =
        this.coverImageIndex !== null && finalImages[this.coverImageIndex]
          ? finalImages[this.coverImageIndex]
          : finalImages.length > 0
          ? finalImages[0]
          : '';

      const productData = {
        ...this.productForm.value,
        images: finalImages,
        imageUrl: coverImageUrl,
      };

      if (this.isEditMode && this.productId) {
        await this.productService.updateProduct(this.productId, productData);
      } else {
        await this.productService.addProduct(productData);
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

    const confirmDelete = confirm(
      'Are you sure you want to delete this product?'
    );
    if (!confirmDelete) return;

    try {
      this.loading = true;
      await this.productService.deleteProduct(this.productId, this.imageDbUrl);
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
