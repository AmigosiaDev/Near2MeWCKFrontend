import { Component, OnInit, HostListener } from '@angular/core';
import { debounce } from 'lodash';
//Other imports
import { Location } from '@angular/common'; //Used for Back Button
import { ActivatedRoute } from '@angular/router'; //
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';
//To import the environment files
import { environment } from '../../environments/environment';
import { ListingService } from './listing.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

const BACKEND_URL = environment.apiUrl;
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})
export class ListingComponent implements OnInit {
  imageURL: any;
  //Declare a constructor to read data from database by calling getAllStudents()
  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private localStorage: LocalStorageService,
    private listingService: ListingService
  ) {}

  //Go Back to previous page Function
  goBack(): void {
    this.location.back();
  }
  // for search
  latitude: any;
  longitude: any;
  selectedDistance: any;
  checkValue1: string;
  isServiceArray: any = null;
  isQuickLinkArray: any = null;
  isSearchArray: any = null;
  isProductArray: any = null;
  locationData: any = null;
  viewCount: number = 0;
  //for lisitng
  checkValue2: string;
  CategoryName: string;

  //for service
  checkValue3: string;

  //for quicklinks
  checkValue4: string;
  quickLinkIdValue: any = '';
  quickLink: any[] = this.listingService.quickLink || [];

  //---------------------------------- Using ActivatedRoutes for checking category----------------------------

  ngOnInit() {
    // this.searchedItems=this.listingService.searchedItems;
    //To call the function that gets the selected location from location service
    this.locationData = this.localStorage.get('locationData');
    console.log('POST PAGE LOCATION DATA', this.locationData);
    this.latitude = this.locationData.latitude;
    this.longitude = this.locationData.longitude;
    this.selectedDistance = this.localStorage.get('selectedDistance') || 100;

    this.route.queryParams.subscribe((params) => {
      this.categoryIdValue = params['passedCategoryIdValue'];
      //for passing latitude and longitude for Text based search
      this.itemName = params['passedSearchTerm'];

      this.checkValue1 = params['checkValue1'];

      //for passing latitude and longitude for category based listing

      this.checkValue2 = params['checkValue2'];

      this.checkValue3 = params['checkValue3'];

      //for passing latitude and longitude for listing category for quick links
      this.quickLinkIdValue = params['passedQuickLinkIdValue'];
      this.checkValue4 = params['checkValue4'];
      this.serviceCategoryIdValue =
        params['passedServiceCategoryIdValue']; /** for services starts **/
    });

    //for search feature
    this.onSubmit();
    this.CategoryName = this.categoryIdValue || this.serviceCategoryIdValue;
    this.CategoryForListing();
  }
  //-------------------------------------SEARCH FUNCTION ----------------------------------------

  //search feature Definition
  onSubmit() {
    if (this.checkValue1 == 'search') {
      this.getSearchResults();
      this.isSearchArray = 'search';

      console.log('search is running');
    }

    if (this.checkValue2 == 'product') {
      this.getAllProduct();
      this.isProductArray = 'product';
      console.log('getAllProduct is running');
    }

    if (this.checkValue3 == 'service') {
      this.getAllService();
      this.isServiceArray = 'service';
      console.log('IsSeERVICE ARRAY: ' + this.isServiceArray);
      console.log('getAllService is running');
    }

    if (this.checkValue4 == 'quickLinks') {
      this.getQuicklinks();
      this.isQuickLinkArray = 'quicklink';
      console.log('getQuicklinks is running');
    }
  }

  //-------------------------------------TEXT BASED SEARCH Listing starts------------------------------------

  getSearchResults() {
    const url =
      BACKEND_URL +
      `/search?query=${encodeURIComponent(this.itemName)}&lat=${
        this.latitude
      }&lng=${this.longitude}&dis=${this.selectedDistance}&page=${
        this.currentPage
      }&limit=${this.limit}`;
    this.http.get(url).subscribe((data: any) => {
      this.totalItems = data.totalCount;
      console.log('url', url);
      console.log('data:::::::' + data);
      // this.searchedItems = data.allSearchResults;
      for (const product of data.allSearchResults) {
        if (
          !this.listingService.searchedItems.some(
            (item: any) => item._id === product._id
          )
        ) {
          this.listingService.searchedItems.push(product);
        }
      }
      console.log('data', data);
      console.log('the searchedItems :', this.searchedItems);
    });
  }
  //-------------------------------------TEXT BASED SEARCH Listing ends------------------------------------

  //-------------------------------------PRODUCTS Listing starts------------------------------------
  currentProductID = '';
  categoryIdValue: any = '';

  //declare variables for search function
  itemName: string = '';
  //We initialize the variables for ID
  productID: any = '';
  productTitle: string = '';
  productPrice: number;
  productUnit: string = '';
  productDescription: string = '';
  productTypeOfSale: string = '';
  productName: string = '';
  statusOfData: string = '';

  ribbonValue: string = 'Festive Specials';
  distanceAway: any;
  //pagination
  searchedItems: any[] = this.listingService.searchedItems || [];
  currentPage: any = this.listingService.currentPage || 1;
  isFetchingData = false;
  limit = 24;
  totalItems = 0;

  loadNextPage() {
    this.listingService.searchedItems = [];
    this.searchedItems = [];
    this.quickLink = [];
    this.listingService.quickLink = [];
    if (this.currentPage * this.limit < this.totalItems) {
      this.currentPage++;
      this.listingService.currentPage++;
      if (this.checkValue2 == 'product') {
        this.getAllProduct();
        this.searchedItems = this.listingService.searchedItems;
        console.log('getAllProduct is running');
      }
      if (this.checkValue1 == 'search') {
        this.getSearchResults();
        this.searchedItems = this.listingService.searchedItems;
        console.log('search is running');
      }
      if (this.checkValue3 == 'service') {
        this.getAllService();
        this.searchedItems = this.listingService.searchedItems;
        console.log('getAllService is running');
      }
      if (this.checkValue4 == 'quickLinks') {
        this.getQuicklinks();
        this.quickLink = this.listingService.quickLink;
        console.log('getQuicklinks is running');
      }
    }
  }

  loadPreviousPage() {
    this.listingService.searchedItems = [];
    this.searchedItems = [];
    this.quickLink = [];
    this.listingService.quickLink = [];
    if (this.currentPage > 1) {
      this.currentPage--;
      this.listingService.currentPage--;
      if (this.checkValue2 == 'product') {
        this.getAllProduct();
        this.searchedItems = this.listingService.searchedItems;
        console.log('getAllProduct is running');
      }
      if (this.checkValue1 == 'search') {
        this.getSearchResults();
        this.searchedItems = this.listingService.searchedItems;
        console.log('search is running');
      }
      if (this.checkValue3 == 'service') {
        this.getAllService();
        this.searchedItems = this.listingService.searchedItems;
        console.log('getAllService is running');
      }
      if (this.checkValue4 == 'quickLinks') {
        this.getQuicklinks();
        this.quickLink = this.listingService.quickLink;
        console.log('getQuicklinks is running');
      }
    }
  }
  // @HostListener('window:scroll', ['$event'])
  // onScroll = debounce(() => {
  //   const scrollPosition = window.innerHeight + window.pageYOffset;
  //   const documentHeight = document.documentElement.scrollHeight;

  //   if (!this.isFetchingData && scrollPosition >= documentHeight - 100) {
  //     this.isFetchingData = true;
  //     console.log('Hello World! You reached the bottom of the screen.');
  //     this.currentPage++;
  //     if (this.checkValue2 == 'product') {
  //       this.getAllProduct();
  //       console.log('getAllProduct is running');
  //     }
  //     if (this.checkValue1 == 'search') {
  //       this.getSearchResults();
  //       console.log('search is running');
  //     }
  //     if (this.checkValue3 == 'service') {
  //       this.getAllService();
  //       console.log('getAllService is running');
  //     }
  //     if (this.checkValue4 == 'quickLinks') {
  //       this.getQuicklinks();
  //       console.log('getQuicklinks is running');
  //     }
  //     // Set a timeout to reset the flag after a short delay (e.g., 500ms)
  //     setTimeout(() => {
  //       this.isFetchingData = false;
  //     }, 500);
  //   }
  // }, 300); // Adjust the debounce delay (in milliseconds) as needed

  //Declare the Function to retreive all the data from the database
  getAllProduct() {
    const url =
      BACKEND_URL +
      `/getListingProduct?lat=${this.latitude}&lng=${this.longitude}&dis=${this.selectedDistance}&Id=${this.categoryIdValue}&page=${this.currentPage}&limit=${this.limit}`;
    this.http.get(url).subscribe((productData: any) => {
      this.totalItems = productData.totalCount;
      console.log(
        'get All Product Data:',
        productData,
        this.categoryIdValue,
        'hellloooooooooooooooooooo'
      );
      // this.searchedItems.push(...productData.products);
      for (const product of productData.products) {
        if (
          !this.listingService.searchedItems.some(
            (item: any) => item._id === product._id
          )
        ) {
          this.listingService.searchedItems.push(product);
        }
      }
      console.log('product Array is: ', this.searchedItems);

      // Extract distances from productArray and log them
      this.distanceAway = this.listingService.searchedItems.map(
        (product) => product.distance
      );
      console.log('Distances:', this.distanceAway);
    });
  }

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
  //-------------------------------------PRODUCTS Listing Ends-----------------------------------

  //-------------------------------------SERVICES Listing Starts------------------------------------
  //Declare an empty array and default values.
  serviceArray: any[] = [];
  serviceID = '';
  serviceCategoryIdValue = '';
  //Declare the Function to retreive all the data from the database
  //----------------------------------For going to Description page----------------------------

  getAllService() {
    const url =
      BACKEND_URL +
      `/getListingService?lat=${this.latitude}&lng=${this.longitude}&dis=${this.selectedDistance}&Id=${this.serviceCategoryIdValue}&page=${this.currentPage}&limit=${this.limit}`;
    this.http.get(url).subscribe((resultData: any) => {
      console.log(resultData);
      this.totalItems = resultData.totalCount;
      // this.searchedItems = resultData.service;
      for (const service of resultData.service) {
        if (
          !this.listingService.searchedItems.some(
            (item: any) => item._id === service._id
          )
        ) {
          this.listingService.searchedItems.push(service);
        }
      }
      console.log('service Array is: ', this.searchedItems);
    });
  }

  gotoSearchServiceDescription(clickedID) {
    //Console the value of the id
    console.log('Clicked ID:', clickedID);
    this.serviceID = clickedID;

    //---------------------------------Using QueryParams to pass Product Name------------------------------
    //We pass the value through the routerlink using queryparams
    this.router.navigate(['/description'], {
      queryParams: {
        passedServiceId: this.serviceID,
        // passedSearchTerm: this.itemName,

        // checkValue1: 'search',
      },
    });
  }

  //-------------------------------------SERVICES Listing ends------------------------------------

  //-------------------------------------QUICK LINKS Listing Starts------------------------------------
  //Declare the Function to retreive all the data from the database
  getQuicklinks() {
    const url =
      BACKEND_URL +
      `/quick-links?query=${encodeURIComponent(this.quickLinkIdValue)}&lat=${
        this.latitude
      }&lng=${this.longitude}&dis=${this.selectedDistance}&page=${
        this.currentPage
      }&limit=${this.limit}`;
    this.http.get(url).subscribe((data: any) => {
      console.log('url', url);
      this.totalItems = data.totalCount;
      for (const product of data.products) {
        if (
          !this.listingService.quickLink.some(
            (item: any) => item._id === product._id
          )
        ) {
          this.listingService.quickLink.push(product);
        }
      }
      // this.quickLink = data.products;
      console.log('data', data);
      console.log('the quickLink :', this.quickLink);
    });
  }

  //to go to Quick links description
  gotoQuickLinkDescription(clickedID) {
    //Console the value of the id
    console.log('Clicked ID:', clickedID);
    this.productID = clickedID;
    this.router.navigate(['/description'], {
      queryParams: {
        passedProductId: this.productID,
        checkValue4: 'quickLinks',
      },
    });
  }
  //-------------------------------------QUICK LINKS Listing ends------------------------------------
  //-------------------------------------To SHARE App------------------------------------

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
  //-------------------------------------To SHARE App ends------------------------------------

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
        return 'Kudumbashree';
      case 'ID_CAT_HOM':
        return 'Homemade';
      case 'ID_CAT_PRO':
        return 'Farm Produce';
      case 'ID_CAT_IND':
        return 'Cottage Industry';
      case 'ID_CAT_KCK':
        return 'Kudumbashree Cloud Kitchen';
      default:
        return '';
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

  CategoryForListing() {
    switch (this.CategoryName) {
      case 'ID_FNV':
        this.CategoryName = 'Farm produce/Fruits and Veg';
        break;
      case 'ID_EGG':
        this.CategoryName = 'Farm produce/Eggs';
        break;
      case 'ID_FNM':
        this.CategoryName = 'Farm produce/Fish & Meat';
        break;
      case 'ID_SAO':
        this.CategoryName = 'Farm produce/Spices and Oils';
        break;
      case 'ID_PUS':
        this.CategoryName = 'Farm produce/Pulses';
        break;
      case 'ID_CRL':
        this.CategoryName = 'Farm produce/Cereals';
        break;
      case 'ID_FPO':
        this.CategoryName = 'Farm produce/Others';
        break;
      case 'ID_CNB':
        this.CategoryName = 'Home Produce/Cakes and Bakes';
        break;
      case 'ID_CNS':
        this.CategoryName = 'Home Produce/Chips and Snacks';
        break;
      case 'ID_RNB':
        this.CategoryName = 'Home Produce/Meals';
        break;
      case 'ID_HYS':
        this.CategoryName = 'Home Produce/Healthy Snacks';
        break;
      case 'ID_PKS':
        this.CategoryName = 'Home Produce/Pickles';
        break;

      case 'ID_HMH':
        this.CategoryName = 'home product/Handmades';
        break;

      case 'ID_HPB':
        this.CategoryName = 'Home product/Beauty products';
        break;
      case 'ID_OHS':
        this.CategoryName = 'Home Produce/Others';
        break;
      case 'ID_PLS':
        this.CategoryName = 'Garden/Plants';
        break;
      case 'ID_SES':
        this.CategoryName = 'Garden/Seeds';
        break;
      case 'ID_NUY':
        this.CategoryName = 'Garden/Nursery';
        break;
      case 'ID_OTS':
        this.CategoryName = 'Garden/Others';
        break;
      case 'ID_DGS':
        this.CategoryName = 'Pets/Dogs';
        break;
      case 'ID_CTS':
        this.CategoryName = 'Pets/Cats';
        break;
      case 'ID_BDS':
        this.CategoryName = 'Pets/Birds';
        break;
      case 'ID_OLF':
        this.CategoryName = 'Pets/Ornamental fish';
        break;
      case 'ID_OES':
        this.CategoryName = 'Pets/Others';
        break;
      case 'ID_CAE':
        this.CategoryName = 'Livestock/Cattle';
        break;
      case 'ID_GNS':
        this.CategoryName = 'Livestock/Goats and Sheep';
        break;
      case 'ID_HES':
        this.CategoryName = 'Livestock/Poultry';
        break;
      case 'ID_ORS':
        this.CategoryName = 'Livestock/Others';
        break;
      case 'ID_HEA':
        this.CategoryName = 'Used Items/Home appliance';
        break;
      case 'ID_ELC':
        this.CategoryName = 'Used Items/Electronics';
        break;
      case 'ID_AUS':
        this.CategoryName = 'Used Items/Autos';
        break;
      case 'ID_UIB':
        this.CategoryName = 'Used Items/Books';
        break;
      case 'ID_OHE':
        this.CategoryName = 'Used Items/Others';
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
}
