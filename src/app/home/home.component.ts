import { Component, OnInit, OnDestroy } from '@angular/core';

//Other imports
import { Router } from '@angular/router';
import { LocationService } from '../select-location/location.service';
import { LocalStorageService } from 'angular-web-storage';
import { ActivatedRoute } from '@angular/router'; //
import { HttpClient } from '@angular/common/http';
import { environment } from '../..//environments/environment';

import { ListingService } from '../listing/listing.service';
import { ShowMoreService } from '../show-more-recent-product/show-more.service';
import { NotificationService } from '../notification.service';
//SweetAlert2
import Swal from 'sweetalert2';

const BACKEND_URL = environment.apiUrl;
const vapidKey = environment.firebase.vapidKey;

interface Product {
  productThumbNailImage: string | null;
  productTitle: string;
  // Other properties...
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private locationservice: LocationService,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private listingService: ListingService,
    private showMoreService: ShowMoreService,
    private NotificationService: NotificationService
  ) {}

  showAllRecentProducts() {
    this.router.navigate(['/show-more-recent-product'], {});
  }

  getFontClass(): string {
    const currentLanguage = localStorage.getItem('setLanguage');

    switch (currentLanguage) {
      case 'en':
        return 'en-font';
      case 'ml':
        return 'ml-font';
      case 'tl':
        return 'tl-font';
      // Handle other languages...
      default:
        return 'en-font'; // Default font size class
    }
  }

  getFontClassSearch(): string {
    const currentLanguage = localStorage.getItem('setLanguage');

    switch (currentLanguage) {
      case 'en':
        return 'en-font';
      case 'ml':
        return 'ml-font-search';
      // Handle other languages...
      default:
        return 'en-font'; // Default font size class
    }
  }
  // Variable to store the scroll position
  private scrollPosition: number = 0;

  //To go to select location
  goToSelectLocation() {
    this.router.navigate(['/select-location'], {
      queryParams: { returnPage: 'home' },
    });
  }

  //To clear local storage on refresh
  //
  // @HostListener('window:unload', ['$event'])
  // unloadHandler(event: Event) {
  //   localStorage.clear();
  // }

  //For Search
  searchTerm: string = null;
  latitude: any = undefined;
  longitude: any = undefined;
  address: any = undefined;
  localStorageAddress: any;
  localStorageLocation: any;
  selectedDistance: number;
  kiloMeters: string = 'Km';
  selectedDistance1: any;
  clearVal: string;
  userCategory: string;
  isScrolltop: any = undefined;
  setLanguage: string = 'en';

  ngOnInit() {
    this.listingService.searchedItems = [];
    this.listingService.quickLink = [];
    this.listingService.currentPage = 1;
    // to reset show more service
    this.showMoreService.currentPage = 0;
    this.showMoreService.totalItems = 0;
    this.showMoreService.showMoreItems = [];
    this.carouselImageDisplay();
    if (localStorage.getItem('isLoggedIn') == 'true') {
      this.fetchUsers();
    }

    this.NotificationService.requestPermission(); //for Notification
    this.NotificationService.listen();
    this.route.queryParams.subscribe((params) => {
      this.clearVal = params['idVal'];
      // this.isScrolltop = params['isScrolltoTop'];
      // console.log('IS SCROLLL: ' + this.isScrolltop);
    });
    // if (this.isScrolltop !== undefined) {
    //   // this.scrollToTop();
    //   console.log('Scroll workingggggggg');
    // }
    console.log(this.clearVal, ' this.clearVal');

    if (this.clearVal === 'clear') {
      this.address = '';
      console.log(this.address, 'inside the if');
    }

    /*Delay set initialize Location for getting Recently added items */

    if (!localStorage.getItem('initialized')) {
      setTimeout(() => {
        if (this.localStorage.get('locationData').address != null) {
          this.localStorageLocation = this.localStorage.get('locationData');

          this.address = this.localStorageLocation.address;
          this.latitude = this.localStorageLocation.latitude;
          this.longitude = this.localStorageLocation.longitude;
          console.log('inside setTimeOutngOnInit', this.localStorageLocation);
        }
        this.getRecentProducts();
        localStorage.setItem('initialized', '1');
        console.log('Inside the SetTimeout');
      }, 5000);
    }
    /*---------------------------------------------------------------------- */

    console.log('localStorageAddress:', this.localStorageAddress);

    if (this.localStorage.get('locationData').address != null) {
      this.localStorageLocation = this.localStorage.get('locationData');

      this.address = this.localStorageLocation.address;
      this.latitude = this.localStorageLocation.latitude;
      this.longitude = this.localStorageLocation.longitude;
      console.log('inside ngOnInit', this.localStorageLocation);

      this.getRecentProducts();
    }

    if (this.localStorage.get('locationData').address == null) {
      // To call the function that gets the selected location from location service
      this.getCurrentLocation();
      console.log('inside else condition of ngOninit', this.address);
    }

    // Retrieve the selected distance from LocalStorage
    this.selectedDistance = this.localStorage.get('selectedDistance') || 100;
    this.selectedDistance1 =
      this.localStorage.get('selectedDistance1') || 'All';
    this.userMobile = this.localStorage.get('passedPhoneNumber');
    if (this.userMobile) {
      this.fetchUsers();
    }

    // Store the scroll position when navigating away from the page
    this.scrollPosition = parseInt(localStorage.getItem('scrollPosition')) || 0;
    console.log('Stored Scroll Position:', this.scrollPosition);
    // Scroll to the stored position
    setTimeout(() => window.scrollTo(0, this.scrollPosition), 0);
  }

  /****** */
  productForHome: any;
  productArray: any;
  productBasedOnDate: any;
  // getRecentProducts() {
  //   const url = BACKEND_URL + '/recentProducts';
  //   this.http.get(url).subscribe(
  //     (data: any) => {
  //       this.productForHome = data.products;
  //       console.log(this.productForHome, 'sfdhsdfhdshfkdshfkdsfdsf');
  //     },
  //     (error: any) => {
  //       console.error('Failed to fetch products:', error);
  //     }
  //   );
  // }

  getRecentProducts() {
    const url = `${BACKEND_URL}/recentProducts?latitude=${this.latitude}&longitude=${this.longitude}`;
    this.http.get(url).subscribe(
      (data: any) => {
        this.productForHome = data.products;
        console.log(this.productForHome, 'Products fetched successfully');
        this.getProductsBasedDate();
      },
      (error: any) => {
        console.error('Failed to fetch products:', error);
      }
    );
  }

  //---------------------------------------------------------------
  /** recent products based on date */
  getProductsBasedDate() {
    const url = `${BACKEND_URL}/productsDate?latitude=${this.latitude}&longitude=${this.longitude}`;
    this.http.get(url).subscribe(
      (data: any) => {
        this.productBasedOnDate = data.products;
        console.log(
          this.productBasedOnDate,
          'productBasedOnDate fetched successfully'
        );
      },
      (error: any) => {
        console.error('Failed to fetch productBasedOnDate:', error);
      }
    );
  }
  //---------------------------------------------------------------

  productID: any = '';

  gotoSearchProductDescription(clickedID) {
    //Console the value of the id
    console.log('Clicked ID for gotoSearchDescription', clickedID);
    this.productID = clickedID;

    //---------------------------------Using QueryParams to pass Product Name------------------------------
    //We pass the value through the routerlink using queryparams
    this.router.navigate(['/description'], {
      queryParams: {
        passedProductId: this.productID,
        // passedSearchTerm: this.itemName,
        // checkValue1: 'search',
      },
    });
  }
  //

  /****** */

  carouselImageDisplay() {
    if (localStorage.getItem('setLanguage')) {
      this.setLanguage = localStorage.getItem('setLanguage');
    }
    console.log(this.setLanguage, 'setLanguage');
  }

  getImageSource(): string {
    // if (this.address) {
    //   if (this.address.includes('Mavelikara')) {
    //     return 'assets/carouselImages/mavelikaraCarousel.jpeg';
    //   } else if (this.address.includes('Palakkad')) {
    //     return 'assets/carouselImages/palakkadCarousel.jpg';
    //   }
    //   //  else if (this.address.includes('Thiruvananthapuram')) {
    //   //   return 'assets/carouselImages/carousel-33.jpeg';
    //   // }
    // }
    return 'assets/carouselImages/carousel-4.jpeg'; // Default image source
  }

  ngOnDestroy() {
    // Store the scroll position when navigating away from the page
    this.scrollPosition = window.scrollY;
    localStorage.setItem('scrollPosition', this.scrollPosition.toString());
    console.log('Stored Scroll Position:', this.scrollPosition);
  }

  /********************************************* */

  users: any;

  userMobile: string;
  profileID: string = null;
  imageURL: string = null;
  fetchUsers(): void {
    //The token goes with HTTP (using http interceptor :-src\app\login\auth.interceptor.ts)
    this.http.get(`${BACKEND_URL}/frontuser`).subscribe(
      (response) => {
        this.users = response;
        console.log('this.users', this.users);

        // this.userMobile = this.users.mobile;
        // // this.whatsApp = this.users.whatsApp;
        // this.userName = this.users.username;
        this.profileID = this.users.profileID;
        // this.address = this.users.address;
        // this.areaOfInterest = this.users.areaOfInterest;
        this.userCategory = this.users.category;
        //  this.about = this.users.about;
        this.imageURL = this.users.profileImageURL;
        console.log('this.imageURL ', this.imageURL);

        localStorage.setItem('userCategory', this.userCategory);
        localStorage.setItem('profileID', this.profileID);
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }
  logIn() {
    if (this.profileID) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
      console.log('hello');
    }
  }

  /********************************************* */

  getCurrentLocation() {
    setTimeout(() => {
      this.locationservice.selectedLocation$.subscribe((locationData) => {
        this.longitude = locationData.longitude;
        this.latitude = locationData.latitude;
        this.address = locationData.address;
        console.log(this.latitude, this.longitude, 'current location');

        this.checkLocationAvailable();

        this.getRecentProducts();
        console.log('Timeout');

        console.log('inside getcurrentlocation', this.address);
        //this.getProductsBasedDate();
      });
    }, 3000);
  }

  // getCurrentLocation() {
  // this.locationservice.selectedLocation$.subscribe((locationData) => {
  //   this.longitude = locationData.longitude;
  //   this.latitude = locationData.latitude;
  //   this.address = locationData.address;
  //   console.log(this.latitude, this.longitude, 'current location');
  //   this.checkLocationAvailable();
  //   this.getRecentProducts();
  //   //this.getProductsBasedDate();
  // });

  // this.locationservice
  //   .getCurrentLocation()
  //   .then(() => {
  //     // Wait for the Promise to resolve before navigating
  //     console.log('this.returnPage');
  //     // Now that the location is obtained, subscribe to the observable
  //     this.locationservice.selectedLocation$.subscribe((locationData) => {
  //       this.longitude = locationData.longitude;
  //       this.latitude = locationData.latitude;
  //       this.address = locationData.address;
  //       console.log(this.latitude, this.longitude, 'current location');
  //       this.checkLocationAvailable();
  //       this.getRecentProducts();
  //       // Additional actions based on locationData...
  //     });
  //   })
  //   .catch((error) => {
  //     console.error('Error getting current location', error);
  //   });
  // }

  checkLocationAvailable() {
    console.log(!this.address == false, 'this.address');
    if (this.address === '') {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => {
            // Location is enabled
            // Do your logic here when location is enabled
            console.log('Location is enabled.');
            this.getCurrentLocation();
          },
          () => {
            // Location is disabled
            this.router.navigate(['/select-location']);
            Swal.fire({
              title: 'Location unavailable.',
              text: 'Please turn on your device location or select your preferred location to continue',
              icon: 'info',

              confirmButtonText: 'Okay',
              confirmButtonColor: 'rgb(38 117 79)',
            });
          }
        );
      } else {
        // Geolocation is not supported
        // Handle accordingly
        console.log('Geolocation is not supported.');
      }
    }
  }

  // /*to scroll to the top*/
  // scrollToTop() {
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // }

  listCategories(dist: number) {
    console.log('dist', dist);

    this.selectedDistance = dist;

    if (this.selectedDistance === 100) {
      this.selectedDistance1 = 'All';
      this.kiloMeters = '';
    } else {
      this.kiloMeters = 'Km';
      this.selectedDistance1 = this.selectedDistance;
    }
    // Store the selected distance in LocalStorage
    this.localStorage.set('selectedDistance', this.selectedDistance);
    this.localStorage.set('selectedDistance1', this.selectedDistance1);
  }

  //We initialize the variables for ID
  serviceIdValue: any = '';

  //For PRODUCTS for text based Search
  goToListing() {
    this.router.navigate(['/listing'], {
      queryParams: {
        passedSearchTerm: this.searchTerm,

        checkValue1: 'search',
      },
    });
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchTerm = this.searchTerm ? this.searchTerm.trim() : null;
      this.goToListing();
    }
  }

  //For SERVICES category based
  gotoServiceListing(event) {
    //---------------------------------FOR getting ID-------------------------------
    //We shall pass the $event variable and access the id property via the current target.
    var target = event.target;
    var idAttr = target.attributes.id;
    this.serviceIdValue = idAttr.nodeValue;
    //Console the value of the id
    console.log('service ID Value:', this.serviceIdValue);
    //--------------------------------Using QueryParams------------------------------
    //We pass the value through the routerlink using queryparams
    this.router.navigate(['/listing'], {
      queryParams: {
        passedServiceCategoryIdValue: this.serviceIdValue,
        checkValue3: 'service',
      },
    });
  }

  /*quicklinks */
  idValue: any = '';

  gotoQuickLinkListing(event) {
    var target = event.target;
    var idAttr = target.attributes.id;
    //
    this.idValue = idAttr.nodeValue;
    //
    ////Console the value of the id
    console.log('idValue:', this.idValue);

    this.router.navigate(['/listing'], {
      queryParams: {
        passedQuickLinkIdValue: this.idValue,
        checkValue4: 'quickLinks',
      },
    });
  }

  //-------------------------------Going to Listing Page---------------------------------
  //For Products category based
  goToCategories(categoryGroup: string) {
    this.router.navigate(['/categories'], {
      queryParams: {
        group: categoryGroup,
      },
    });
  }

  goToQuickLinks() {
    this.router.navigate(['/show-all-quick-links'], {});
  }

  goToAllService() {
    this.router.navigate(['/show-all-service'], {});
  }

  goToAllProduct() {
    this.router.navigate(['/show-all-products'], {});
  }

  getDisplayName(productTypeOfSale: string): string {
    switch (productTypeOfSale) {
      case 'ORG':
        return 'Organic';
      case 'FRE':
        return 'Free';
      case 'DIS':
        return 'Discounted';
      case 'SEA':
        return 'Seasonal';
      case 'EXO':
        return 'Exotic';
      case 'FES':
        return 'Festival';
      default:
        return '';
    }
  }

  getRibbonStyles(productTypeOfSale: string): object {
    switch (productTypeOfSale) {
      case 'ORG':
        return { 'background-color': '#A0C49D' };
      case 'FRE':
        return { 'background-color': '#FFD1D1' };
      case 'DIS':
        return { 'background-color': '#FD8A8A' };
      case 'SEA':
        return { 'background-color': '#95BDFF' };
      case 'EXO':
        return { 'background-color': '#AF7AB3' };
      case 'FES':
        return { 'background-color': '#F1C27B' };
      default:
        return {};
    }
  }
}
