import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import{MatFormFieldModule} from '@angular/material/form-field';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule, MatFormFieldModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
email = '';
  password = '';
  private auth = inject(AuthService);
  private router = inject(Router);

  async onSignup() {
    try {
      await this.auth.signup(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (err) {
      alert('Signup failed: ' + (err as any).message);
    }
  }
}
