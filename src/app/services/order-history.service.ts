import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  constructor(private httpClient:HttpClient) { }

  private orderUrl = environment.shoppingApiUrl+'/orders';

  getOrderHistory(email:string):Observable<GetOrderHistoryResponse>{
    //build url based on custmer url
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;
    return this.httpClient.get<GetOrderHistoryResponse>(orderHistoryUrl);
  }
}

interface GetOrderHistoryResponse{
  _embedded:{
    orders:OrderHistory[];
  }
}