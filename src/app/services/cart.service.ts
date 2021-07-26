import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems:CartItem[] = [];
  totalPrice:Subject<number> = new Subject<number>();
  totalQuantity:Subject<number> = new Subject<number>();
  
  constructor() { }

  addToCart(cartItem: CartItem){
    // check if already have a item in cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem:CartItem = undefined;
    // find the item in the cart based on item id
    if(this.cartItems.length > 0){
      // for(let tempCartItem of this.cartItems){
      //   if(tempCartItem.id == cartItem.id){
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id);
    }
    // check if we found it
    alreadyExistsInCart = (existingCartItem != undefined);
    if(alreadyExistsInCart){
      //if it is already there and user clicked the add to cart again increae the quantity
      existingCartItem.quantity++;
    }
    else{
      //add the item to the array
      this.cartItems.push(cartItem); 
    }

    //compute total price and quantity
    this.computeTotalPriceAndQuantity();

  }
  computeTotalPriceAndQuantity() {
    let totalPriceofItems:number = 0;
    let totalQuantiyofitems:number = 0;

    for(let cartItem of this.cartItems){
      totalPriceofItems += cartItem.unitPrice*cartItem.quantity;
      totalQuantiyofitems += cartItem.quantity;
    }
    //publish the new values, all subscribers will be able to receive it
    this.totalPrice.next(totalPriceofItems);
    this.totalQuantity.next(totalQuantiyofitems);

    //logging cart data
    this.logCartData(totalPriceofItems,totalQuantiyofitems);
  }
  logCartData(totalPriceofItems: number, totalQuantiyofitems: number) {
    for(let cartItem of this.cartItems){
      const subTotalPrice = cartItem.unitPrice * cartItem.quantity;
      console.log(`Name: ${cartItem.name} subTotalPrice: ${subTotalPrice} quantity: ${cartItem.quantity}`);
    }
    console.log(`totalPrice: ${totalPriceofItems.toFixed(2)} totalQuantity: ${totalQuantiyofitems}`);
  }
}
