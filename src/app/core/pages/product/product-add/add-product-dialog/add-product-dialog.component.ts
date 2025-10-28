import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { addDoc, collection ,collectionData,Firestore,serverTimestamp } from '@angular/fire/firestore';
import { getDownloadURL, ref ,Storage, uploadBytes } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-product-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
     MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-product-dialog.component.html',
  styleUrl: './add-product-dialog.component.scss'
})
export class AddProductDialogComponent {
private firestore = inject(Firestore);
  private storage = inject(Storage);
  private dialogRef = inject(MatDialogRef<AddProductDialogComponent>);
  categories: any[] = [];


   productData = {
    name: '',
    description: '',
    price: null,
    coverImage: '',
    createdAt: serverTimestamp(),
    categoryId: ''
  };

     ngOnInit(): void {
    this.loadCategories();
  }
/** 📦 Load all categories from Firestore */
  loadCategories() {
    const catRef = collection(this.firestore, 'categories');
    collectionData(catRef, { idField: 'id' }).subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error loading categories:', err),
    });
  }

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  uploading = false;

  /** 📤 Handle file input + preview */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  /** 🚀 Save product */
  async saveProduct() {
    if (!this.productData.name || !this.productData.price) {
      alert('Name and price are required.');
      return;
    }

    this.uploading = true;
    try {
      let imageUrl = '';
      if (this.selectedFile) {
        const filePath = `products/${Date.now()}_${this.selectedFile.name}`;
        const storageRef = ref(this.storage, filePath);
        await uploadBytes(storageRef, this.selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const productsRef = collection(this.firestore, 'products');
      await addDoc(productsRef, {
        ...this.productData,
        coverImage: imageUrl,
      });

      this.dialogRef.close('success');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Something went wrong while saving.');
    } finally {
      this.uploading = false;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
