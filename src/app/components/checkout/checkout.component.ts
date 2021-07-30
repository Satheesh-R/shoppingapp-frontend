import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  constructor(private formBuillder: FormBuilder) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuillder.group({
      customer: this.formBuillder.group({
        firstName: [''],
        lastName: [''],
        emailAddress: ['']
      }),
      shippingAddress: this.formBuillder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuillder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuillder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    })
  }

  onSubmit(){
    console.log("Form Data: ")
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("Mail: ",this.checkoutFormGroup.get('customer').value.emailAddress);
  }

  copyShippingAddressToBillingAddress(event){
    console.log("INSIDE EVENT HANDLER")
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
          .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.checkoutFormGroup.controls.billingAddress.disable();
    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.checkoutFormGroup.controls.billingAddress.enable();
    }
  }
}
