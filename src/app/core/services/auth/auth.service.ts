import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private auth = inject(Auth);
  private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  user$ = this.currentUserSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

   async signup(email: string, password: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('User created:', userCredential.user);

      // ✅ Successful signup
      alert('Signup successful! Redirecting to dashboard...');
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already registered. Redirecting to login...');
        // Auto redirect to login after 2 seconds
        setTimeout(() => this.router.navigate(['/login']), 2000);
      } else if (error.code === 'auth/invalid-email') {
        alert('Invalid email format. Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        alert('Password is too weak. Please use at least 6 characters.');
      } else {
        console.error(error);
        alert('Something went wrong. Please try again later.');
      }
    }
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/dashboard']);
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

   get currentUser() {
    return this.currentUserSubject.value;
  }

  
}
