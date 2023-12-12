import { Component, OnInit } from '@angular/core';
//Other imports
import { Location } from '@angular/common'; //Used for Back Button
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { VerifyPhoneNumberService } from '../verify-phone-number/verify-phone-number.service';
//To import the environment files
import { environment } from '../../environments/environment';
//SweetAlert2
import Swal from 'sweetalert2';
const BACKEND_URL = environment.apiUrl;
@Component({
  selector: 'app-enter-your-name',
  templateUrl: './enter-your-name.component.html',
  styleUrls: ['./enter-your-name.component.css'],
})
export class EnterYourNameComponent implements OnInit {
  //Go Back to previous page  Function
  goBack(): void {
    this.location.back();
  }

  //Initialize the values
  passedPhoneNumber: string;
  userName: String;
  userID: String;
  //Declare an empty array and default values of input to null.
  newUserArray: any[] = [];
  currentNewUserDatabaseID = '';
  userData$ = new Observable();
  profileID = localStorage.getItem('profileID');
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private verifyservice: VerifyPhoneNumberService
  ) {}

  //Actiivated route to receive phone number
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.passedPhoneNumber = params['passedPhoneNumber'];
    });
    console.log('Passed Phone Number', this.passedPhoneNumber);
    /* this.getAllNewUser() ;*/
  }

  sendName() {
    if (this.userName) {
      // return alert("Please enter a name to continue");
      console.log('sendName:::::::::', this.userName, this.profileID);
      this.userData$ = this.verifyservice.saveName(
        this.userName,
        this.profileID
      );
      this.userData$.subscribe((result) => {
        // this.router.navigate(['/enter-user-category']);
        this.router.navigate(['/home']);
      });
    } else {
      Swal.fire({
        title: 'Alert',
        text: 'Please enter a name to continue',
        icon: 'warning',

        confirmButtonText: 'Okay',
        confirmButtonColor: 'rgb(38 117 79)',
      });
    }
  }
}
