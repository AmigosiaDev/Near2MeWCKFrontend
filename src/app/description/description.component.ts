import { Component, OnInit, HostListener, Inject } from '@angular/core';

//Other imports
import { DOCUMENT } from '@angular/common';
import { AuthUserService } from '../auth-user.service';
import { Location } from '@angular/common'; //Used for Back Button
import { HttpClient } from '@angular/common/http'; //Used for  HTTP Get Request
import { ActivatedRoute } from '@angular/router'; //Used for getting query params form product-listing page
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';
import { DatePipe } from '@angular/common';
import { debounce } from 'lodash';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

//SweetAlert2
import Swal from 'sweetalert2';
interface CheckInterestResponse {
  isInterestShown: boolean;
}
//To import the environment files
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl;
@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})
export class DescriptionComponent implements OnInit {
  /*---------------------------------Share the current Page------------------------------*/

  sharePage() {
    const name = `Homegrown vegetables and Homemade products from your locality.`;
    const pageUrl = this.document1.URL;

    if (navigator.share) {
      navigator
        .share({
          title: name,
          url: pageUrl,
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      Swal.fire({
        title: 'Alert',
        text: 'Sharing is not supported on your device/browser.',
        icon: 'warning',

        confirmButtonText: 'Okay',
        confirmButtonColor: 'rgb(38 117 79)',
      });
    }
  }

  //Go Back to previous page Function
  goBack(): void {
    this.location.back();
    // this.router.navigate(['/listing']);
  }
  navigateToProductDescription(productID) {
    const queryParams = { passedProductId: productID, passedServiceId: null };
    this.router.navigate(['/description'], { queryParams });
  }
  navigateToServiceDescription(serviceID) {
    const queryParams = { passedServiceId: serviceID, passedProductId: null };
    this.router.navigate(['/description'], { queryParams });
  }

  imageURL: any;

  //Declare a constructor to read data from database by calling getAllStudents() and Location for goBack()
  constructor(
    private AuthUserService: AuthUserService,
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private localStorage: LocalStorageService,
    private datePipe: DatePipe,
    @Inject(DOCUMENT) private document1: Document
  ) {
    this.route.queryParams.subscribe((params) => {
      this.productID = params['passedProductID'];
      // Perform necessary actions with the new query parameter
    });
    console.log('Constructor PRODUCT ID: ' + this.productID);
    console.log('Constructor Service ID: ' + this.serviceID);
    // this.getSearchResults();
  }

  profileID: string = null;
  //for serach
  itemName: string;
  latitude: number;
  longitude: number;
  selectedDistance: number;

  productDBID: string;
  serviceDBID: string;
  productID: string = null;
  searchId: string;
  serviceID: string = null;
  curentDescriptionID: string;
  searchArray: any;
  productName: string;
  //for fav
  passedDataBaseID: string = null;
  sellerFavButton: boolean = false;

  //for lisitng

  isInterestShown: boolean = false;
  categoryIdValue: string;
  locationData: any = null;
  viewCount: number = 0;

  favSeller: string = null;
  //---------------------------------- Using ActivatedRoutes for getting passed Product ID, Service ID----------------------------

  ngOnInit() {
    //To Check Authentication
    this.AuthUserService.authUser();
    this.profileID = localStorage.getItem('profileID');

    //To call the function that gets the selected location from location service
    this.locationData = this.localStorage.get('locationData');
    console.log('DESCRIPTION LOCATION DATA', this.locationData);
    this.latitude = this.locationData.latitude;
    this.longitude = this.locationData.longitude;

    console.log('this lat: ' + this.latitude + ' lon: ' + this.longitude);
    this.selectedDistance = this.localStorage.get('selectedDistance') || 100;

    this.route.queryParams.subscribe((params) => {
      this.productID = params['passedProductId'];
      this.favSeller = params['profileID'];
      if (this.productID) {
        this.serviceID = null;
        this.passedDataBaseID = null;
        this.curentDescriptionID = this.productID;
        console.log(
          'curentDescriptionID for Product is::::' + this.curentDescriptionID
        );
        this.getSearchResults();
        this.scrollToTop();
        console.log('PRODUCT ID SEARCH HAPPENED' + this.productID);
      }
      this.serviceID = params['passedServiceId'];
      if (this.serviceID) {
        this.productID = null;
        this.passedDataBaseID = null;
        this.curentDescriptionID = this.serviceID;
        console.log(
          'curentDescriptionID for Service is::::' + this.curentDescriptionID
        );
        this.getSearchResults();
        this.scrollToTop();
        console.log('SERVICE ID SEARCH HAPPENED' + this.serviceID);
      }
      //for favourites
      this.passedDataBaseID = params['passedDataBaseId'];
      if (this.passedDataBaseID) {
        this.productID = null;
        this.serviceID = null;
        this.curentDescriptionID = this.passedDataBaseID;
        this.getSearchResults();
        this.scrollToTop();
        console.log(
          'curentDescriptionID for FAVOURITE is::::' + this.curentDescriptionID
        );
        console.log('FAVOURITE ID SEARCH HAPPENED' + this.passedDataBaseID);
      }
    });
  }

  incrementProductViewCount() {
    this.http
      .put(BACKEND_URL + `/productViewCount/${this.productDBID}`, {})
      .subscribe(
        () => {},
        (error) => {
          // Handle any errors
          console.error(error);
        }
      );
    // location.reload();
  }

  incrementServiceViewCount() {
    this.http
      .put(BACKEND_URL + `/serviceViewCount/${this.serviceDBID}`, {})
      .subscribe(
        () => {},
        (error) => {
          // Handle any errors
          console.error(error);
        }
      );
    // location.reload();
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

  // Define the latitude and longitude of the destination location.
  destinationLatitude: any = null;
  destinationLongitude: any = null;

  openGoogleMapsDirections() {
    // Construct the Google Maps URL with the destination coordinates.
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${this.destinationLatitude},${this.destinationLongitude}`;

    // Open the Google Maps URL in a new tab or window.
    window.open(googleMapsUrl, '_blank');
  }

  getSearchResults() {
    if (this.serviceID) {
      this.searchId = this.serviceID;
    } else if (this.productID) {
      this.searchId = this.productID;
    } else if (this.passedDataBaseID) {
      this.searchId = this.passedDataBaseID;
    }
    console.log('SEARCH ID::::::::' + this.searchId);
    const url =
      BACKEND_URL +
      `/search-description?query=${encodeURIComponent(this.searchId)}&lat=${
        this.latitude
      }&lng=${this.longitude}&dis=${this.selectedDistance}&profileID=${
        this.profileID
      }`;

    this.http.get(url).subscribe((data: any): void => {
      console.log('url', url);
      // Modify the address property in each object
      data.allSearchResults?.forEach((result: any) => {
        if (result.address) {
          let tempArray;
          tempArray = result.address.split(',').filter((item) => {
            if (!item.includes('+')) {
              // console.log(i);
              return item;
              //alternative solution for removing the plus code--------------------------------
              // console.log(result.address.split(",").splice(i, 1));
              // let tempArray = result.address.split(',');
              // tempArray = tempArray.toString().replace(tempArray[i], '');
              // tempArray = tempArray.toString().replace(',,', ',');
              // console.log('temp Array', tempArray);
              //----------------------------------------------------------------
            }
          });
          console.log(tempArray);
          result.address = tempArray.toString();
          result.address = result.address.replace(/, India\s*$/, '');
        }
        // if (result.address) {
        //   if (/\w{4}\+\w{2,3}/.test(result.address)) {
        //     // Find the index of the comma
        //     const commaIndex = result.address.indexOf(',');

        //     // Remove any leading single character before the comma
        //     if (commaIndex !== -1) {
        //       result.address = result.address
        //         .substring(commaIndex + 1)
        //         .replace(/^\s*\w,\s*/, '');
        //     }
        //   }

        //   // Remove ", India" if present
        //   result.address = result.address.replace(/, India\s*$/, '');
        // }
      });
      this.searchArray = data.allSearchResults;
      console.log('searchArray:::', this.searchArray);
      // if(this.searchArray.length===0){
      //    this.router.navigate(['/seller-details'], {
      //     queryParams: {
      //       profileID: this.favSeller,

      //     },

      //   });
      //   return
      // }
      this.destinationLatitude = this.searchArray[0].location.coordinates[1];
      this.destinationLongitude = this.searchArray[0].location.coordinates[0];
      this.sellerId = this.searchArray[0].profileID;
      if (this.searchArray[0].productID) {
        this.productDBID = this.searchArray[0]._id;
        this.productName = this.searchArray[0].productTitle;
        this.viewCount = this.searchArray[0].views;

        this.CategoryName = this.CategoryID =
          this.searchArray[0].productCategory;
        this.CategoryForListing();
        this.incrementProductViewCount();
      } else if (this.searchArray[0].serviceID) {
        this.serviceDBID = this.searchArray[0]._id;
        this.productName = this.searchArray[0].serviceTitle;
        this.viewCount = this.searchArray[0].views;
        this.incrementServiceViewCount();
      }

      this.checkInterest();

      // console.log(this.sellerId)
      if (this.sellerId) {
        this.getOtherProducts();
        this.getSellerDetails();
      }
      this.isIconBackgroundToggled = this.searchArray[0].isFavorite;

      // if(this.searchArray[0].isSellerFavorite1){
      this.sellerFavButton = this.searchArray[0].isFavoriteSeller;
      // }

      // if(this.searchArray[0].isSellerFavorite2){
      //   this.sellerFavButton = this.searchArray[0].isSellerFavorite2
      // }

      //this.isIconBackgroundToggled =  data.allSearchResults.isFavorite
      console.log('isIconBackgroundToggled', this.isIconBackgroundToggled);
      console.log(' this.sellerFavButton ::::::::::', this.sellerFavButton);

      console.log('the productArray :', this.searchArray);
    });
  }
  CategoryID: string;
  CategoryName: string;

  CategoryForListing() {
    switch (this.CategoryName) {
      case 'ID_FNV':
        this.CategoryName = 'Farm produce / Fruits and Veg';
        break;
      case 'ID_EGG':
        this.CategoryName = 'Farm produce / Eggs';
        break;
      case 'ID_FNM':
        this.CategoryName = 'Farm produce / Fish & Meat';
        break;
      case 'ID_SAO':
        this.CategoryName = 'Farm produce / Spices and Oils';
        break;
      case 'ID_PUS':
        this.CategoryName = 'Farm produce / Pulses';
        break;
      case 'ID_CRL':
        this.CategoryName = 'Farm produce / Cereals';
        break;
      case 'ID_FPO':
        this.CategoryName = 'Farm produce / Others';
        break;
      case 'ID_CNB':
        this.CategoryName = 'Home Produce / Cakes and Bakes';
        break;
      case 'ID_CNS':
        this.CategoryName = 'Home Produce / Chips and Snacks';
        break;
      case 'ID_RNB':
        this.CategoryName = 'Home Produce / Meals';
        break;
      case 'ID_HYS':
        this.CategoryName = 'Home Produce / Healthy Snacks';
        break;
      case 'ID_PKS':
        this.CategoryName = 'Home Produce / Pickles';
        break;

      case 'ID_HMH':
        this.CategoryName = 'home product / Handmades';
        break;

      case 'ID_HPB':
        this.CategoryName = 'Home product / Beauty products';
        break;
      case 'ID_OHS':
        this.CategoryName = 'Home Produce / Others';
        break;
      case 'ID_PLS':
        this.CategoryName = 'Garden / Plants';
        break;
      case 'ID_SES':
        this.CategoryName = 'Garden / Seeds';
        break;
      case 'ID_NUY':
        this.CategoryName = 'Garden / Nursery';
        break;
      case 'ID_OTS':
        this.CategoryName = 'Garden / Others';
        break;
      case 'ID_DGS':
        this.CategoryName = 'Pets / Dogs';
        break;
      case 'ID_CTS':
        this.CategoryName = 'Pets / Cats';
        break;
      case 'ID_BDS':
        this.CategoryName = 'Pets / Birds';
        break;
      case 'ID_OLF':
        this.CategoryName = 'Pets / Ornamental fish';
        break;
      case 'ID_OES':
        this.CategoryName = 'Pets / Others';
        break;
      case 'ID_CAE':
        this.CategoryName = 'Livestock / Cattle';
        break;
      case 'ID_GNS':
        this.CategoryName = 'Livestock / Goats and Sheep';
        break;
      case 'ID_HES':
        this.CategoryName = 'Livestock / Poultry';
        break;
      case 'ID_ORS':
        this.CategoryName = 'Livestock / Others';
        break;
      case 'ID_HEA':
        this.CategoryName = 'Used Items / Home appliance';
        break;
      case 'ID_ELC':
        this.CategoryName = 'Used Items / Electronics';
        break;
      case 'ID_AUS':
        this.CategoryName = 'Used Items / Autos';
        break;
      case 'ID_UIB':
        this.CategoryName = 'Used Items / Books';
        break;
      case 'ID_OHE':
        this.CategoryName = 'Used Items / Others';
        break;
      case 'ID_FRM':
        this.CategoryName = 'Services/ Farm Services';
        break;
      case 'ID_SKL':
        this.CategoryName = 'Services/ Skilled Services';
        break;
      case 'ID_LLE':
        this.CategoryName = 'Services/ Local Events';
        break;
      case 'ID_OTH':
        this.CategoryName = 'Services/ Other Services';
        break;

      default:
        this.CategoryName = 'Search Results';
        break;
    }
  }

  goToListing() {
    this.router.navigate(['/listing'], {
      queryParams: {
        passedCategoryIdValue: this.CategoryID,
        checkValue2: 'product',
      },
    });
  }

  //----------------------------------*********************************************************----------------------------------

  /*------------------------------------ADD TO FAV----------------------------*/

  favoriteId: string;
  passedId: string;
  isIconBackgroundToggled = false;

  toggleIconBackground(type: string) {
    this.isIconBackgroundToggled = !this.isIconBackgroundToggled;

    if (this.productID === null) {
      this.passedId = this.serviceID;
    } else {
      this.passedId = this.productID;
    }
    // if (this.isIconBackgroundToggled == true) {
    //   alert('Added to favorites');
    // } else {
    //   alert('Removed from favorites');
    // }

    const favoriteId = 'FAV' + new Date().getTime().toString().substr(3, 10);

    const favoriteData = {
      favoriteId: favoriteId,
      profileID: this.profileID,
      type: type,
      id: this.passedId,
    };

    this.registerFavorite(favoriteData).subscribe(
      () => {
        console.log('favorites button is clicked');
      },
      (error) => console.error(error)
    );
  }

  registerFavorite(favoriteData: any) {
    return this.http.post(BACKEND_URL + '/addFav', favoriteData, {
      responseType: 'text',
    });
  }

  /*---------------------------------*******------------------------------*/

  //-----------------------add seller to favorites------------------------
  addSellerFav(type: string) {
    this.sellerFavButton = !this.sellerFavButton;
    const favoriteId = 'FAV' + new Date().getTime().toString().substr(3, 10);
    const favoriteData = {
      favoriteId: favoriteId,
      profileID: this.profileID,
      type: type,
      id: this.sellerId,
    };
    this.registerFavorite(favoriteData).subscribe(
      () => {
        console.log('favorites button is clicked');
      },
      (error) => console.error(error)
    );
    console.log('addSeller', type, this.sellerId);
  }

  /*to scroll to the top*/
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ------- other products from same seller --------------------------------

  otherProducts: any[] = [];

  //pagination
  currentPage = 1;
  isFetchingData = false;
  limit = 20;

  @HostListener('window:scroll', ['$event'])
  onScroll = debounce(() => {
    const scrollPosition = window.innerHeight + window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight;

    if (!this.isFetchingData && scrollPosition >= documentHeight - 100) {
      this.isFetchingData = true;

      console.log('Hello World! You reached the bottom of the screen.');
      this.currentPage++;
      this.getOtherProducts();
      // Set a timeout to reset the flag after a short delay (e.g., 500ms)
      setTimeout(() => {
        this.isFetchingData = false;
      }, 500);
    }
  }, 300); // Adjust the debounce delay (in milliseconds) as needed
  sellerDetails: any;
  sellerName: string;
  sellerPhone: string;
  sellerwhatsApp: string;
  memberSince: any;
  sellerMessage: string;
  sellerImageURL: string;
  sellerID: string;
  sellerCategory: string;
  getSellerDetails() {
    this.http
      .get(BACKEND_URL + `/getSeller/${this.sellerId}`)
      .subscribe((sellerDetails: any) => {
        this.sellerCategory = sellerDetails.category;
        this.sellerDetails = sellerDetails;
        this.sellerName = this.sellerDetails.username;
        this.memberSince = this.sellerDetails.date;
        this.sellerPhone = this.sellerDetails.mobile;
        this.sellerwhatsApp = this.sellerDetails.whatsApp;
        this.sellerImageURL = this.sellerDetails.profileImageURL;
        this.sellerID = this.sellerDetails.profileID;
        this.sellerMessage = `Hi, I'm interested in your post on Near2Me. Please get back to me if ${this.productName} is available.`;
        console.log('Seller Data:', this.sellerDetails);
        console.log(this.sellerMessage);
      });
  }
  redirectToProductSellerDetails(sellerID: string, productDBID: string) {
    // Redirect to the seller details page and pass the profileId as a parameter in the URL
    this.router.navigate(['/seller-details'], {
      queryParams: {
        profileID: sellerID,
        productDBID: productDBID,
        productName: this.productName,
      },
    });
  }

  redirectToServiceSellerDetails(sellerID: string, sellerDBID: string) {
    // Redirect to the seller details page and pass the profileId as a parameter in the URL
    this.router.navigate(['/seller-details'], {
      queryParams: {
        profileID: sellerID,
        serviceDBID: sellerDBID,
        productName: this.productName,
      },
    });
  }

  getOtherProducts() {
    this.http
      .get(
        BACKEND_URL +
          `/getAllListing/${this.sellerId}?&page=${this.currentPage}&limit=${this.limit}`
      )
      .subscribe((listingData: any) => {
        console.log('get All Product Data:', listingData);
        listingData.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.otherProducts = [...this.otherProducts, ...listingData];

        console.log('other product Array is: ', this.otherProducts);
      });
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

  getStyles(userCategory: string): any {
    switch (userCategory) {
      case 'ID_CAT_KUD':
        return { 'background-color': '#DBDFEA' };
      case 'ID_CAT_STO':
        return { 'background-color': '#E4D0D0' };
      case 'ID_CAT_HOM':
        return { 'background-color': '#FAEDCD' };
      case 'ID_CAT_PRO':
        return { 'background-color': '#C7E9B0' };
      case 'ID_CAT_IND':
        return { 'background-color': '#DBE4C6' };
      default:
        return '';
    }
  }

  getUserCategory(userCategory: string) {
    switch (userCategory) {
      case 'ID_CAT_STO':
        return 'Store';
      case 'ID_CAT_KUD':
        return 'Kudumbasree';
      case 'ID_CAT_HOM':
        return 'Homemade';
      case 'ID_CAT_PRO':
        return 'Farm Produce';
      case 'ID_CAT_IND':
        return 'Cottage Industry';
      default:
        return 'Seller';
    }
  }

  serviceCategory(serviceCategory: string) {
    switch (serviceCategory) {
      case 'ID_FRM':
        return 'Farm Services';
      case 'ID_SKL':
        return 'Skilled Services';
      case 'ID_LLE':
        return 'Local Events';
      case 'ID_OTH':
        return 'Other Services';
      default:
        return '';
    }
  }

  //send Notification to seller when showinterested clicked
  sellerId: string = '';
  message: any;
  browserToken: string = '';

  // sellerPhone = this.localStorage.get('passedPhoneNumber');

  sendNotificationToSeller(
    sellerId: string,
    productTitle: string,
    productID: string
  ) {
    console.log(sellerId, productTitle, productID);
    Swal.fire({
      title: 'Confirm Notification to seller',
      text: 'Send notification to the seller showing your interest on this posting?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Okay',
      confirmButtonColor: 'rgb(38 117 79)',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Notification Sent! 😀',
          text: '',
          icon: 'success',

          confirmButtonText: 'Okay',
          confirmButtonColor: 'rgb(38 117 79)',
        });
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const customerID: any = localStorage.getItem('profileID');
        console.log(isLoggedIn, customerID, productID);
        if (isLoggedIn && customerID) {
          console.log(sellerId);
          const url = BACKEND_URL + `/products/notify-seller`;
          const formData = new FormData();
          formData.append('customerID', customerID);
          formData.append('sellerId', sellerId);
          formData.append('productTitle', productTitle);
          formData.append('productID', productID);
          this.http.post(url, formData).subscribe((response) => {
            console.log(response);
            this.isInterestShown = true;
            // this.getNotifications();
            if (this.productDBID) {
              this.incrementProductContactCount();
            } else if (this.serviceDBID) {
              this.incrementServiceContactCount();
            }
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Notification Not Sent.',
          icon: 'info',
          confirmButtonColor: 'rgb(38 117 79)',
        });
        return;
      }
    });
  }

  checkInterest() {
    // Get the authentication token from Local Storage
    const token = localStorage.getItem('authToken');

    if (!token) {
      // If token is not present, navigate to the login page
      this.router.navigate(['/login']);
      return;
    }
    const customerID: any = localStorage.getItem('profileID');
    if (this.searchArray) {
      const productID: any =
        this.searchArray[0].productID || this.searchArray[0].serviceID;
      this.http
        .get<CheckInterestResponse>(
          `${BACKEND_URL}/check-interest/${customerID}/${productID}`
        )
        .subscribe((response) => {
          this.isInterestShown = response.isInterestShown;
          // console.log(this.isInterestShown)
        });
    }
  }
}
