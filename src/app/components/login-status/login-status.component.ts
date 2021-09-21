import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated:boolean =false;
  username:string='';
  constructor(private oktaAuthService:OktaAuthService) { }

  ngOnInit(): void {

    //subscribe to authentication state changes
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
        this.getUserDetails();
      } 
    );
  }
  getUserDetails() {
    if(this.isAuthenticated){
      //fetch logged in user claims
      this.oktaAuthService.getUser().then(
        (result) => this.username = result.name
      )
    }
  }

  logout(){
    //Terminates session with Okta and removes current token
    this.oktaAuthService.signOut();
  }
}
