import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private formBuillder: FormBuilder,
    private formService:FormService) { }
 
  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  cardYears: number[] = [];
  cardMonths: number[] = [];

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

    //populating card month & year
    this.formService.getCreditCardYear().subscribe(
      data => this.cardYears = data
    );

    const startMonth = new Date().getMonth();
    this.formService.getCreditCardMonth(startMonth).subscribe(
      data => this.cardMonths = data
    );

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

  handleMonthandYear(){
    const cardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(cardFormGroup.value.expirationYear);
    let startMonth:number;
    
    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }
    else{
      startMonth = 1;
    }
    this.formService.getCreditCardMonth(startMonth).subscribe(
      data => this.cardMonths = data
    );
  }
}
