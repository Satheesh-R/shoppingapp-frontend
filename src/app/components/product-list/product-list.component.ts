import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  currentCategoryId:number = 1;
  previousCategoryId: number = 1;
  products: Product[];
  searchMode:boolean = false;
  //pagination properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  previousSearchString:string = 'No';
 
  constructor(private productService:ProductService,
              private route:ActivatedRoute,
              private cartService:CartService ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
     () => this.listProducts()
    );
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const searchString = this.route.snapshot.paramMap.get('keyword');
    /**
     * searching for the products using given keyword
     * If we have different keyword than previous keyword
     * then set tha epage number to 1
     */
    if(this.previousSearchString != searchString){
      this.pageNumber = 1;
    }
    this.previousSearchString = searchString;
    this.productService.searchProductsListPagination(searchString,
                                                     this.pageNumber - 1,
                                                     this.pageSize).subscribe(this.processResult());
  }

  handleListProducts(){
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
    /**
     * Check if we have a different category id than previous
     * Not: Angular will reuse a component if it is currently viewed
     * 
     * if we have a different category id than previous,
     * then we have reset the page number back to 1
     */
    
    if(this.previousCategoryId != this.currentCategoryId){
      this.pageNumber = 1;
    }
    
    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId = ${this.currentCategoryId}, pageNumber = ${this.pageNumber}`);
    //getting products for given category id
    this.productService.getProductsListPagination(this.pageNumber-1,
                                                  this.pageSize,
                                                  this.currentCategoryId).subscribe(
                                                    this.processResult()
                                                  );
    
  }

  updatePageSize(pageSize:number){
    this.pageSize = pageSize;
    this.pageNumber = 1
    this.listProducts();
  }

  processResult(){
    return data => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }

  addToCart(product:Product){
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`);
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
}
