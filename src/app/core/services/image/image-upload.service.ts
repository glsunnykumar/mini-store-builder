import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import imageCompression from 'browser-image-compression';


@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private storage: Storage) { }

  
  async uploadImage(file: File, path: string): Promise<string> {
    // Compress image before upload
    try {
      console.log('Starting compression...');
      const compressedFile = await this.compressImage(file);
      console.log('Compression complete. Compressed size:', compressedFile.size);

      const storageRef = ref(this.storage, path);
      console.log('Uploading to storage path:', path);

      const snapshot = await uploadBytes(storageRef, compressedFile);
      console.log('Upload successful. Getting download URL...');

      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained:', downloadURL);

      return downloadURL;

    } catch (error: any) {
      console.error('Image upload failed:', error);
      if (error.code) {
        console.error('Firebase error code:', error.code);
      }
      throw error;
    }
  }

   private async compressImage(file: File): Promise<File> {
    const options = {
      maxSizeMB: 0.3,   // Limit ~300KB
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };

    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  }
}
