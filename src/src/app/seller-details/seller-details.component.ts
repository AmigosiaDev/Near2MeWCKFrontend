import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
//Other imports
import { Location } from '@angular/common'; //Used for Back Button
import { environment } from 'src/environments/environment';
//SweetAlert2
import Swal from 'sweetalert2';

const BACKEND_URL = environment.apiUrl;
@Component({
  selector: 'app-seller-details',
  templateUrl: './seller-details.component.html',
  styleUrls: ['./seller-details.component.css'],
})
export class SellerDetailsComponent implements OnInit, OnDestroy {
  //Go Back to previous page Function
  goBack(): void {
    this.location.back();
  }

  profileID: string;
  sellerprofileID: string;
  productDBID: string;
  serviceDBID: string;
  sellerDetails: any;
  sellerPhone: string;
  sellerMessage: string;
  messageToConsumer: string;
  sellerImageURL: string;
  userCategory: string;
  memberSince: any;
  about: string;
  sellerWhatsApp: string;
  address: string;
  reportMessage: string = '';
  private scrollPosition: number = 0;
  isZoomed: boolean = false;
  productName: string;
  userImageURL: any = [];
  isZoomedImg0: boolean = false;
  isZoomedImg1: boolean = false;
  isZoomedImg2: boolean = false;

  toggleImageZoom() {
    this.isZoomed = !this.isZoomed;
  }
  closeImageZoom() {
    this.isZoomed = false;
  }

  toggleImageZoomImg0() {
    this.isZoomedImg0 = !this.isZoomedImg0;
  }

  toggleImageZoomImg1() {
    this.isZoomedImg1 = !this.isZoomedImg1;
  }

  toggleImageZoomImg2() {
    this.isZoomedImg2 = !this.isZoomedImg2;
  }

  closeImageZoomImg0() {
    this.isZoomedImg0 = false;
  }

  closeImageZoomImg1() {
    this.isZoomedImg1 = false;
  }

  closeImageZoomImg2() {
    this.isZoomedImg2 = false;
  }

  ngOnInit(): void {
    this.profileID = localStorage.getItem('profileID');
    console.log('PID::::::::', this.profileID);
    // Store the scroll position when navigating away from the page
    this.scrollPosition = parseInt(localStorage.getItem('scrollPosition')) || 0;
    console.log('Stored Scroll Position:', this.scrollPosition);
    // Scroll to the stored position
    setTimeout(() => window.scrollTo(0, this.scrollPosition), 0);

    // Extract the profileId from the query parameters
    this.route.queryParamMap.subscribe((params) => {
      this.sellerprofileID = params.get('profileID');
      this.productDBID = params.get('productDBID');
      this.serviceDBID = params.get('serviceDBID');
      this.messageToConsumer = params.get('messageToConsumer');
      this.productName = params.get('productName');
      // console.log(this.profileID);
      // Now, you can send this profileId to the backend to retrieve the seller details
      this.getSellerDetails(this.sellerprofileID);
    });
    console.log(
      'Seller Pro and User Pro',
      this.sellerprofileID,
      this.profileID
    );
  }

  ngOnDestroy() {
    // Store the scroll position when navigating away from the page
    this.scrollPosition = 0;
    localStorage.setItem('scrollPosition', this.scrollPosition.toString());
    console.log('Stored Scroll Position:', this.scrollPosition);
  }

  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute
  ) {}
  getSellerDetails(profileID: string): any {
    // Replace 'your-backend-api-url' with the actual endpoint for fetching seller details
    const apiUrl = `${BACKEND_URL}/getSeller/${profileID}`;
    // Use HttpClient to make a GET request to the backend API with the profileId as a query parameter
    return this.http
      .get<any>(apiUrl, { params: { profileID: profileID } })
      .subscribe((res) => {
        this.sellerDetails = res;
        this.sellerPhone = this.sellerDetails.mobile;
        this.memberSince = this.sellerDetails.date;
        this.sellerImageURL = this.sellerDetails.profileImageURL;

        for (let i = 0; i < this.sellerDetails.userImageURL.length; i++) {
          if (this.sellerDetails.userImageURL[i]) {
            this.userImageURL[i] = this.sellerDetails.userImageURL[i];
            console.log('USERIMAGEURL' + this.userImageURL[i]);
          }
        }

        if (this.messageToConsumer == 'true') {
          this.sellerMessage =
            'Hi. Thank you for your interest. Please let me know how can I help you?';
        } else {
          this.sellerMessage = `Hi, I'm interested in your post on Near2Me. Please get back to me if ${this.productName} is available.`;
        }

        this.about = this.sellerDetails.about;
        this.sellerWhatsApp = this.sellerDetails.whatsApp;
        this.address = this.sellerDetails.address;
        console.log(this.sellerDetails, this.sellerPhone);
        console.log('seller category::::::' + this.sellerDetails.category);
        this.userCategory = this.getUserCategory(this.sellerDetails.category);
      });
  }
  /***the user profile image */

  defaultImage = 'assets/personImages/defaultimage.jpg';

  getUserCategory(userCategory: any) {
    switch (userCategory) {
      case 'ID_CAT_STO':
        return 'Store';
      case 'ID_CAT_KUD':
        return 'Kudumbashree';
      case 'ID_CAT_HOM':
        return 'Homemade';
      case 'ID_CAT_PRO':
        return 'Farm Produce';
      case 'ID_CAT_IND':
        return 'Cottage Industry';
      case 'ID_CAT_SEL':
        return 'Seller';
      case 'ID_CAT_KCK':
        return 'Kudumbashree Cloud Kitchen';
      default:
        return 'Seller';
    }
  }

  countUp() {
    if (this.productDBID) {
      this.incrementProductContactCount();
    } else if (this.serviceDBID) {
      this.incrementServiceContactCount();
    }
  }

  incrementProductContactCount() {
    this.http
      .put(BACKEND_URL + `/productContactCount/${this.productDBID}`, {})
      .subscribe(
        () => {},
        (error) => {
          // Handle any errors
          console.error(error);
        }
      );
    // location.reload();
  }

  incrementServiceContactCount() {
    this.http
      .put(BACKEND_URL + `/serviceContactCount/${this.serviceDBID}`, {})
      .subscribe(
        () => {},
        (error) => {
          // Handle any errors
          console.error(error);
        }
      );
    // location.reload();
  }

  addReport() {
    // Replace with the actual profile ID
    const reporterID = this.profileID; // Replace with the actual reporter ID
    const message = this.reportMessage;
    const apiUrl = `${BACKEND_URL}/addReport/${this.sellerprofileID}`;

    const reportData = {
      reporterID: reporterID,
      message: message,
    };

    this.http.post(apiUrl, reportData).subscribe(
      (response) => {
        console.log('Report added:', response);
        // Perform any additional actions if needed
        Swal.fire({
          title: 'The user has been Reported successfully',
          text: '',
          icon: 'info',

          confirmButtonText: 'Okay',
          confirmButtonColor: 'rgb(38 117 79)',
        });
      },
      (error) => {
        Swal.fire({
          title: 'The user Report was Unsuccessful',

          icon: 'error',

          confirmButtonText: 'Okay',
          confirmButtonColor: 'rgb(38 117 79)',
        }).then((result) => {
          if (result.isConfirmed) {
            // For more information about handling dismissals please visit
            // https://sweetalert2.github.io/#handling-dismissals
          }
        });
      }
    );
  }
}
