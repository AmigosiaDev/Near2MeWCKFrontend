import { Component, OnInit, OnDestroy } from '@angular/core';
//other imports
import { Location } from '@angular/common'; //Used for Back Button
import { ActivatedRoute, Router } from '@angular/router';
import { timer, Subscription, Observable } from 'rxjs';
import { VerifyPhoneNumberService } from './verify-phone-number.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-verify-phone-number',
  templateUrl: './verify-phone-number.component.html',
  styleUrls: ['./verify-phone-number.component.css'],
})
export class VerifyPhoneNumberComponent implements OnInit, OnDestroy {
  //Go Back to previous page  Function
  goBack(): void {
    this.location.back();
  }

  //Initialize the values
  otpValue: string;
  passedPhoneNumber: string;
  profileID: string;
  date: any;
  isResendDisabled = true;
  isButtonEnabled: boolean = false;

  countDown: Subscription;
  counter = 60;
  tick = 1000;
  otpTimerData$ = new Observable();
  authData$ = new Observable();
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private verifyOTP: VerifyPhoneNumberService,
    private loginservice: LoginService
  ) {}

  updateButtonState() {
    this.isButtonEnabled = this.otpValue.length === 4;
  }

  //Actiivated route to receive phone number
  ngOnInit() {
    // this.countDown = timer(0, this.tick).subscribe(() =>
    //   this.counter > 0 ? --this.counter : 0
    // );

    this.countDown = timer(0, this.tick).subscribe(() => {
      if (this.counter > 0) {
        --this.counter;
        this.isResendDisabled = true; // Disable the button while counter is running
      } else {
        this.isResendDisabled = false; // Enable the button when counter reaches 0
      }
    });

    this.route.queryParams.subscribe((params) => {
      this.passedPhoneNumber = params['userPhoneNumber'];
      this.otpTimerData$ = this.verifyOTP.getTimer(this.passedPhoneNumber);
    });

    this.otpTimerData$.subscribe((result) => {
      if (result['time'] && this.counter - parseInt(result['time']) <= 0) {
        this.counter = 0;
      } else if (result['time']) {
        this.counter = this.counter - result['time'];
      } else if (result['expired'] && result['expired'] == true) {
        this.counter = 0;
      }
    });
  }

  ngOnDestroy() {
    this.countDown = null;
  }

  handleEnterKeyPress(event: Event) {
    if ((event as KeyboardEvent).key === 'Enter') {
      this.verifyNumber();
    }
  }

  //Function to simulate OTP verification
  verifyNumber() {
    this.profileID = 'PID' + new Date().getTime().toString().substr(3, 10);
    this.authData$ = this.verifyOTP.verify(
      this.passedPhoneNumber,
      this.otpValue,
      this.profileID,
      (this.date = new Date().toISOString().substring(0, 10))
    );
    localStorage.setItem('profileID', this.profileID);
    this.authData$.subscribe((result) => {
      if (result['token']) {
        window.localStorage.setItem('authToken', result['token']);
        if (result['usernameStatus'] == true) {
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/home']);
        } else {
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/enter-your-name'], {
            queryParams: { passedPhoneNumber: this.passedPhoneNumber },
          });
        }
      } else {
      }
    });
    
  }
  //Function to show OTP
  resendOTP() {
    console.log('button is clicked');
    this.isResendDisabled = true;
    this.loginservice
      .mobileLogin(this.passedPhoneNumber)
      .subscribe((response) => {
        if (response['return'] === true) {
          this.counter = 60;
          this.countDown.unsubscribe();
          this.countDown = timer(0, this.tick).subscribe(() =>
            this.counter > 0 ? --this.counter : 0
          );
        }
      });
  }
 
}
