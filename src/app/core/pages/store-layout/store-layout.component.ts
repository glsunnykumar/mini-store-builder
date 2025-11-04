import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreNavbarComponent } from '../store-navbar/store-navbar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-store-layout',
   imports: [RouterOutlet,
     StoreNavbarComponent,
     MatIconModule
    ],
  templateUrl: './store-layout.component.html',
  styleUrl: './store-layout.component.scss'
})
export class StoreLayoutComponent {

   currentYear = new Date().getFullYear();

}
