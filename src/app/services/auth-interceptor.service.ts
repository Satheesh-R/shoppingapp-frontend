import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { Observable,from } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private oktaAuthService:OktaAuthService) { }
  
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request,next));
  }
  
  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    //add access token for secured endpoints
    const apiEndpoint = environment.shoppingApiUrl + '/orders';
    const securedEndpoints = [apiEndpoint];

    if(securedEndpoints.some(url => request.urlWithParams.includes(url))){
      //get access(JWT) token
      const accessToken = await this.oktaAuthService.getAccessToken();

      //clone the request and add new header with access(JWT) token
       request = request.clone({
         setHeaders:{
           Authorization: 'Bearer '+accessToken
         }
       })
    }
    return next.handle(request).toPromise();
  }
}
