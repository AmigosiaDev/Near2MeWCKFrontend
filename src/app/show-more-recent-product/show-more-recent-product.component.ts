import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common'; //Used for Back Button
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'angular-web-storage';
import { ShowMoreService } from './show-more.service';
import { ListingService } from '../listing/listing.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

const BACKEND_URL = environment.apiUrl;
@Component({
  selector: 'app-show-more-recent-product',
  templateUrl: './show-more-recent-product.component.html',
  styleUrls: ['./show-more-recent-product.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate(300)), // Adjust the duration (300ms) as needed
    ]),
  ],
})
export class ShowMoreRecentProductComponent implements OnInit {
  locationData: any = null;
  productID: any = '';
  latitude: any;
  longitude: any;
  //pagination
  showMoreItems: any[] = this.ShowMoreService.showMoreItems || [];
  currentPage: any = this.ShowMoreService.currentPage || 1;
  isFetchingData = false;
  limit = 30;
  totalItems = 0;
  loading: boolean = false;
  disableNextPage: boolean = false;
  filterValue: boolean = false;
  filterType: string = 'date';
  filterCardProduct: boolean = false;
  filterCardDate: boolean = false;
  showSpinner: boolean = false;

  loadNextPage() {
    this.loading = true;
    this.ShowMoreService.showMoreItems = [];
    this.showMoreItems = [];

    if (this.currentPage * this.limit < this.totalItems) {
      this.currentPage++;
      this.ShowMoreService.currentPage++;
      console.log('currentpage  is ' + this.ShowMoreService.currentPage);
      if (this.filterType === 'date') {
        this.getProductsBasedDate();
      }
      if (this.filterType === 'distance') {
        this.getRecentProducts();
      }

      this.showMoreItems = this.ShowMoreService.showMoreItems;
      console.log('getAllProduct is running');
    }
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Use 'auto' instead of 'smooth' for instant scrolling
    console.log('getAllProduct is running');
  }

  loadPreviousPage() {
    this.loading = true;
    this.ShowMoreService.showMoreItems = [];
    this.showMoreItems = [];

    if (this.currentPage > 1) {
      this.currentPage--;
      this.ShowMoreService.currentPage--;

      if (this.filterType === 'date') {
        this.getProductsBasedDate();
      }
      if (this.filterType === 'distance') {
        this.getRecentProducts();
      }
      this.showMoreItems = this.ShowMoreService.showMoreItems;
      console.log('getAllProduct is running');
    }

    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Use 'auto' instead of 'smooth' for instant scrolling
    console.log('getAllProduct is running');
  }

  ngOnInit() {
    this.listingService.searchedItems = [];
    this.listingService.quickLink = [];
    this.listingService.currentPage = 1;
    //To call the function that gets the selected location from location service
    this.locationData = this.localStorage.get('locationData');
    console.log('POST PAGE LOCATION DATA', this.locationData);
    this.latitude = this.locationData.latitude;
    this.longitude = this.locationData.longitude;
    console.log(
      'Show More Items Length',
      this.ShowMoreService.showMoreItems.length,
      this.ShowMoreService.currentPage
    );
    this.totalItems = this.ShowMoreService.totalItems;
    this.productBasedOnDate = this.ShowMoreService.showMoreItems;
    if (this.ShowMoreService.showMoreItems.length == 0) {
      this.getProductsBasedDate();
    }
  }

  filter() {
    this.filterValue = !this.filterValue;
  }
  closeOverlay(): void {
    // Set filterValue to false to hide the overlay
    this.filterValue = false;
  }
  dateBasedFilter() {
    this.showSpinner = true;
    this.filterValue = !this.filterValue;
    this.filterType = 'date';
    this.filterCardProduct = !this.filterCardProduct;
    this.getProductsBasedDate();
  }

  distanceBasedFilter() {
    this.showSpinner = true;
    this.filterValue = !this.filterValue;
    this.filterType = 'distance';
    this.filterCardProduct = !this.filterCardProduct;
    this.getRecentProducts();
  }

  constructor(
    private http: HttpClient,
    private location: Location,
    private localStorage: LocalStorageService,
    private router: Router,
    private ShowMoreService: ShowMoreService,
    private listingService: ListingService
  ) {}

  //Go Back to previous page Function
  goBack(): void {
    this.location.back();
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

  //--------------------------------------Show all recently added products based on date --------------------------
  productBasedOnDate: any;
  getProductsBasedDate() {
    this.showSpinner = true;
    const url = `${BACKEND_URL}/showMoreProductsDate?latitude=${this.latitude}&longitude=${this.longitude}&page=${this.currentPage}&limit=${this.limit}&limit=${this.limit}`;
    // this.totalItems = productData.totalCount;
    this.http.get(url).subscribe(
      (data: any) => {
        data.products.forEach((result: any) => {
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
          }
        });

        this.productBasedOnDate = data.products;
        //For Pagination
        this.ShowMoreService.totalItems = data.totalCount;
        this.totalItems = this.ShowMoreService.totalItems;
        console.log('Total Items: ', this.totalItems);
        console.log(
          this.productBasedOnDate,
          'productBasedOnDate fetched successfully'
        );
        this.showSpinner = false;
        for (const product of this.productBasedOnDate) {
          if (
            !this.ShowMoreService.showMoreItems.some(
              (item: any) => item._id === product._id
            )
          ) {
            this.ShowMoreService.showMoreItems.push(product);
          }
        }
      },
      (error: any) => {
        console.error('Failed to fetch productBasedOnDate:', error);
      },
      () => {
        // Set loading to false when the request is complete
        this.loading = false;
      }
    );
  }
  //--------------------------------------Show all recently added products based on date ends--------------------------

  productBasedOnDistance: any;
  getRecentProducts() {
    const url = `${BACKEND_URL}/showMoreRecentProducts?latitude=${this.latitude}&longitude=${this.longitude}&page=${this.currentPage}&limit=${this.limit}&limit=${this.limit}`;
    this.http.get(url).subscribe(
      (data: any) => {
        data.products.forEach((result: any) => {
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
          }
        });

        this.productBasedOnDistance = data.products;
        console.log(
          this.productBasedOnDistance,
          'Products fetched successfully'
        );
        this.totalItems = this.ShowMoreService.totalItems;
        this.productBasedOnDate = null;
        this.showSpinner = false;
        for (const product of this.productBasedOnDistance) {
          if (
            !this.ShowMoreService.showMoreItems.some(
              (item: any) => item._id === product._id
            )
          ) {
            this.ShowMoreService.showMoreItems.push(product);
          }
        }
      },
      (error: any) => {
        console.error('Failed to fetch products:', error);
      },
      () => {
        // Set loading to false when the request is complete
        this.loading = false;
      }
    );
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
}
