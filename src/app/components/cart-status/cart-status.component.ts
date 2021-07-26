import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice:number = 0.00;
  totalQuantity:number = 0;
  
  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    //subscribe to totalPrice and totalQuantity
    
    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data;
        console.log('Total Price in Cart Status: '+ this.totalPrice);
      }
    );

    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
        console.log('Total Quantity in Cart Status: '+ this.totalQuantity);
      }
    )
  }

}
