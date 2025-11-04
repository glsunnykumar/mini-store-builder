import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private firestore: Firestore, private storage: Storage) {}

  getCategories() {
    const col = collection(this.firestore, 'categories');
    return collectionData(col, { idField: 'id' });
  }

  async addCategory(data: any, file?: File) {
    let imageUrl = '';
    if (file) {
      const fileRef = ref(this.storage, `categories/${uuidv4()}_${file.name}`);
      await uploadBytes(fileRef, file);
      imageUrl = await getDownloadURL(fileRef);
    }

    const col = collection(this.firestore, 'categories');
    await addDoc(col, {
      ...data,
      coverImage: imageUrl,
      createdAt: new Date(),
    });
  }


    async getCategoryById(id: string) {
    const ref = doc(this.firestore, 'categories', id);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  }

  async updateCategory(id: string, data: any) {
    const ref = doc(this.firestore, 'categories', id);
    await updateDoc(ref, data);
  }

  async deleteCategory(id: string) {
    const ref = doc(this.firestore, 'categories', id);
    await deleteDoc(ref);
  }

}
