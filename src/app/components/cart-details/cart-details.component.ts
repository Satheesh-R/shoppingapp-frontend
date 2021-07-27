import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] =[];
  totalPrice: number;
  totalQuantity: number;
  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    // subscribe to the total price
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )

    // subscribe to the cart total quantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )

    //compute the total price and quantity
    this.cartService.computeTotalPriceAndQuantity();
  }

  incrementQuantity(cartItem:CartItem){
    this.cartService.addToCart(cartItem);
  }

  decrementQuantity(cartItem:CartItem){
    this.cartService.decrementQuantity(cartItem);
  }

  removeItem(cartItem:CartItem){
    this.cartService.remove(cartItem);
  }
}
