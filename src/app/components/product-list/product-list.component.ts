import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  currentCategoryId:number;
  products: Product[];
  constructor(private productService:ProductService,
              private route:ActivatedRoute ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
     () => this.listProducts()
    );
  }
  listProducts() {
    //checking if route has category id
    const hasCategoryId:boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      //converting 'id' param string to number
      
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      console.log(this.currentCategoryId);
    }
    else{
      this.currentCategoryId = 1;
    }
    //getting products for given category id
    this.productService.getProductsList(this.currentCategoryId).subscribe(
      data =>{
        this.products = data;
      }
    )
  }
}
