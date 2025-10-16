import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import{MatFormFieldModule} from '@angular/material/form-field';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
   name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = ''; // ✅ Add this line
  hidePassword = true;
  hideConfirm = true;

  private auth = inject(AuthService);
  private router = inject(Router);

 
  onSignup() {
    console.log('signup button is clicked');
    this.auth.signup(this.email, this.password);
  }
}
