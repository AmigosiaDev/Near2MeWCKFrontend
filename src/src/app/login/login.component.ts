import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { Location } from '@angular/common'; //Used for Back Button

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  goBack() {
    throw new Error('Method not implemented.');
  }
  myModel = true;
  constructor(
    private router: Router,
    private loginservice: LoginService,
    private location: Location
  ) {}

  //For schema
  newUserPhoneNumber: string = '';

  checkPhoneNumberLength() {
    // Check if the phone number is exactly 10 digits
    return this.newUserPhoneNumber.length !== 10;
  }

  handleEnterKeyPress(event: Event) {
    if ((event as KeyboardEvent).key === 'Enter') {
      this.passPhoneNumber();
    }
  }

  passPhoneNumber() {
    let userPhoneNumber = this.newUserPhoneNumber;
    this.loginservice.mobileLogin(userPhoneNumber).subscribe((response) => {
      if (response['return'] === true) {
        this.router.navigate(['/verify-phone-number'], {
          queryParams: { userPhoneNumber: userPhoneNumber },
        });
      }
    });
  }

  //Go Back to previous page Function
  goToBack(): void {
  //this.location.back();
   this.router.navigate(['/home']);
  }
  TermsAndConditions(){
    this.router.navigate(['/terms-and-conditions']);
  }
  PrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }
}
