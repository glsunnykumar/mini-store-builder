import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.scss'
})
export class OrderSuccessComponent {

  orderId: string | null = null;
  total: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}
   ngOnInit() {
    this.orderId = this.route.snapshot.queryParamMap.get('id');
    const totalParam = this.route.snapshot.queryParamMap.get('total');
    this.total = totalParam ? parseFloat(totalParam) : null;
  }

  goToStore() {
    this.router.navigate(['/store']);
  }

  viewOrders() {
    this.router.navigate(['/orders']);
  }

}
