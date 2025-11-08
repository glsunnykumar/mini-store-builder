import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Auth, onAuthStateChanged, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  displayName = '';
  email = '';
  photoURL: string | null = null;
  newPhotoFile: File | null = null;
  loading = false;

  constructor(private auth: Auth, private firestore: Firestore) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.user = user;
        this.displayName = user.displayName || '';
        this.email = user.email || '';
        this.photoURL = user.photoURL || null;

        // Optional: fetch more user data from Firestore
        const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data['displayName']) this.displayName = data['displayName'];
          if (data['photoURL']) this.photoURL = data['photoURL'];
        }
      }
    });
  }

  onFileSelected(event: any) {
    this.newPhotoFile = event.target.files[0];
    if (this.newPhotoFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.photoURL = e.target.result);
      reader.readAsDataURL(this.newPhotoFile);
    }
  }

  async saveProfile() {
    if (!this.user) return;
    this.loading = true;

    try {
      let uploadedUrl = this.photoURL;
      if (this.newPhotoFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `profile_images/${this.user.uid}.jpg`);
        await uploadBytes(storageRef, this.newPhotoFile);
        uploadedUrl = await getDownloadURL(storageRef);
      }

      await updateProfile(this.user, {
        displayName: this.displayName,
        photoURL: uploadedUrl,
      });

      await setDoc(doc(this.firestore, 'users', this.user.uid), {
        displayName: this.displayName,
        photoURL: uploadedUrl,
        email: this.email,
      });

      alert('✅ Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Error updating profile!');
    } finally {
      this.loading = false;
    }
  }
}
