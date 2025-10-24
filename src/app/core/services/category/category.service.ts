import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';
import { from } from 'rxjs';

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
}
