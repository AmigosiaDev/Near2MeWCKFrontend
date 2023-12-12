import { Component, OnInit } from '@angular/core';
//Other imports
import { HttpClient } from '@angular/common/http';
/***the user profile image */
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { PwaService } from '../pwa.service'; // Import the PwaService
const BACKEND_URL = environment.apiUrl;
//SweetAlert2
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  //Declare an empty array and default values of input to null.
  defaultImage = 'assets/personImages/person.jpg';

  userName: string = null;
  mobileNumber: string = null;
  isZoomed: boolean = false;

  toggleImageZoom() {
    this.isZoomed = !this.isZoomed;
  }

  closeImageZoom() {
    this.isZoomed = false;
  }

  users: any;
  //userName: string = null;

  passedId: string = null;
  address: string = null;
  areaOfInterest: string = null;
  category: string = null;
  about: string = undefined;
  profileID: string = null;
  userMobile: string = null;
  whatsApp: string = null;
  imageURL: string = null;
  isPwaInstalled: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService,
    public pwaService: PwaService,
    private location: Location
  ) {
    this.checkPwaInstallationStatus();
  }

  // Function to check if the PWA is installed
  checkPwaInstallationStatus() {
    const mediaQueryList = window.matchMedia('(display-mode: standalone)');
    console.log('Media query matches:', mediaQueryList.matches); // Debug line
    this.isPwaInstalled = mediaQueryList.matches;
    console.log('Check PWA installation status:', this.isPwaInstalled);
  }
  ngOnInit(): void {
    this.authToken = localStorage.getItem('authToken');
    if (localStorage.getItem('isLoggedIn') == 'true') {
      this.fetchUsers();
    }

    // location.reload();

    this.userSettings();
  }
  installPopup() {
    if (
      navigator.platform === 'iPhone' ||
      navigator.platform === 'iPad' ||
      navigator.platform === 'iPod'
    ) {
      alert(
        'Tap the "Share" button at the bottom of the screen and select "Add to Home Screen".'
      );
    } else {
      // this.pwaService.installPWA();
      window.location.href =
        'https://play.google.com/store/apps/details?id=app.near2me.twa';
    }
  }
  fetchUsers(): void {
    //The token goes with HTTP (using http interceptor :-src\app\login\auth.interceptor.ts)
    this.http.get(`${BACKEND_URL}/getuser`).subscribe(
      (response) => {
        this.users = response;
        console.log('this.users', this.users);

        this.mobileNumber = this.users.mobile;
        // this.whatsApp = this.users.whatsApp;
        this.userName = this.users.username;
        // this.passedId = this.users[0]._id;
        // this.address = this.users.address;
        // this.areaOfInterest = this.users.areaOfInterest;
        // this.category = this.users.category;
        //  this.about = this.users.about;
        this.imageURL = this.users.profileImageURL;
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }

  userSettings() {
    this.mobileNumber = this.localStorage.get('passedPhoneNumber');
    this.userName = this.localStorage.get('passedUserName');
    this.profileID = localStorage.getItem('profileID');
    console.log(this.userName);
    console.log(this.mobileNumber);
    console.log(this.profileID);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
  authToken: string = null;
  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You sure you want to log out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Log out!',
      confirmButtonColor: 'rgb(38 117 79)',
      cancelButtonText: 'No, keep me logged in',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userCategory');
        localStorage.removeItem('profileID');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('doNotShowIntroduction');
        //alert('logout completed');
        location.reload();
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      }
    });

    // if (confirm('Are you sure you want to logout your account?')) {

    // }
  }

  share() {
    if (navigator.share) {
      const name = `Local classifieds for homegrown vegetables and homemade products in your locality.`;

      const near2meUrl = 'https://near2me.info/';

      const message1 = `Search for your needs within your preferred location.`;

      const contact = `For feedback and queries, please contact:
      mail: support@near2me.info
      tel:  +91 80621 80611`;

      const message2 = `Why Near2Me?
      * Local economic development
      * Woman empowerment
      * Self-reliant community
      * Build community relationships
      `;

      const message3 = `Download Near2me from GooglePlay`;

      const near2MeAppUrl = `https://play.google.com/store/apps/details?id=app.near2me.twa `;

      const sharedText = `${name}\n\n ${message1}\n\n${message2}\n${message3}\n${near2MeAppUrl}\n\n${contact}\n\n`;

      navigator
        .share({
          url: near2meUrl,
          title: name,
          text: sharedText,
        })
        .then(() => console.log('Shared successfully.'))
        .catch((error) => console.log('Sharing failed:', error));
    } else {
      console.log('Web Share API not supported.');
    }
  }

  deleteUserAccount() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once you have deleted your account, all your postings will be unrecoverable',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: 'rgb(231 105 105)',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .delete<any>(BACKEND_URL + `/delete/${this.profileID}`)
          .subscribe(
            (response) => {
              // Handle success, e.g., show a success message, redirect, etc.
              //alert(response.message);
              console.log(response);
              localStorage.removeItem('passedPhoneNumber');
              localStorage.removeItem('passedUserName');
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('authToken');
              localStorage.removeItem('userCategory');
              localStorage.removeItem('profileID');
              localStorage.removeItem('doNotShowIntroduction');
              location.reload();
            },
            (error) => {
              // Handle error, e.g., show an error message, log the error, etc.
              console.log(error);
            }
          );
        Swal.fire({
          title: 'Your Account has been deleted.',
          icon: 'success',
          confirmButtonText: 'Okay',
          confirmButtonColor: 'rgb(38 117 79)',
        });
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your Account is safe :)',
          icon: 'success',
          confirmButtonColor: 'rgb(38 117 79)',
        });
      }
    });
  }

  contactUs() {
    this.router.navigate(['/contact-us']);
  }
  AboutUs() {
    this.router.navigate(['/about-us']);
  }
  Faq() {
    this.router.navigate(['/faq']);
  }
  TermsAndConditions() {
    this.router.navigate(['/terms-and-conditions']);
  }
  PrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }
}
