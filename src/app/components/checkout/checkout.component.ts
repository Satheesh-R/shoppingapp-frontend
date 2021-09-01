import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { FormService } from 'src/app/services/form.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private formBuillder: FormBuilder,
    private formService:FormService,
    private cartService:CartService) { }
 
  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  cardYears: number[] = [];
  cardMonths: number[] = [];
  countries:Country[] = [];
  shippingStates: State[] = [];
  billingStates: State[] = [];

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuillder.group({
      customer: this.formBuillder.group({
        firstName: new FormControl('',[Validators.required, Validators.minLength(2),CustomValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('',[Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace]),
        email: new FormControl('',[Validators.required, 
                                      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuillder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2),CustomValidators.notOnlyWhiteSpace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2),CustomValidators.notOnlyWhiteSpace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.pattern('[0-9]{6}')])
      }),
      billingAddress: this.formBuillder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2),CustomValidators.notOnlyWhiteSpace]),
        city:new FormControl('',[Validators.required, Validators.minLength(2),CustomValidators.notOnlyWhiteSpace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required,  Validators.pattern('[0-9]{6}')])
      }),
      creditCard: this.formBuillder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required,Validators.minLength(2),CustomValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('',[Validators.required,Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',[Validators.required,Validators.pattern('[0-9]{3}')]),
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
    
    this.formService.getCountries().subscribe(
      data => this.countries = data
    );
    this.reviewCartDetails();
  }
  
  onSubmit(){
    console.log("Form Data: ")
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("Mail: ",this.checkoutFormGroup.get('customer').value.emailAddress);
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
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

  getStates(formGroup:string){
    const countryCode = this.checkoutFormGroup.get(formGroup).value.country.code;
    this.formService.getStates(countryCode).subscribe(
      data => {
        if(formGroup === 'shippingAddress'){
          this.shippingStates = data;
        }
        else{
          this.billingStates = data;
        }

        //select first value by default
        this.checkoutFormGroup.get(formGroup).get('state').setValue(data[0]);
      }
    )
  }
  reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      (data) => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      (data) => this.totalQuantity = data
    );
  }
  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}
  
  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  
  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode');}
  
  get cardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
  get nameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get securityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}
  get cardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
}