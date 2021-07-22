import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  constructor(private route:ActivatedRoute,private productservice:ProductService) { }
  product:Product = new Product();
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(
      () => this.getProduct()
    );
  }

  getProduct(){
    const productId = +this.route.snapshot.paramMap.get('id');
    this.productservice.getProduct(productId).subscribe(
      data => this.product = data
    );
  }

}
