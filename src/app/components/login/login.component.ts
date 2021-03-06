import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import AppConfig from '../../config/app-config';
import * as OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;
  constructor(private oktaAuthService:OktaAuthService) { 
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      features:{
        registration: true
      },
      baseUrl: AppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: AppConfig.oidc.clientId,
      redirectUri: AppConfig.oidc.redirectUri,
      authParams:{
        pkce:true,
        issuer:AppConfig.oidc.issuer,
        scopes: AppConfig.oidc.scopes
      }  
    });
  }

  ngOnInit(): void {
    this.oktaSignin.remove();
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'    // el value should be same as div id of login component
    },
    (reponse) => {
      if(reponse.status === 'SUCCESS'){
        this.oktaAuthService.signInWithRedirect();
      }
    },
    (error) =>{
      throw error;
    })
  }

}
