import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreNavbarComponent } from '../store-navbar/store-navbar.component';

@Component({
  selector: 'app-store-layout',
   imports: [RouterOutlet, StoreNavbarComponent],
  templateUrl: './store-layout.component.html',
  styleUrl: './store-layout.component.scss'
})
export class StoreLayoutComponent {

}
