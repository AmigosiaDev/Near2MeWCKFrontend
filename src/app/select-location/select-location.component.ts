import { Component, Input, OnInit } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { HttpParams } from '@angular/common/http';
import { LocationService } from './location.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common'; //Used for Back Button
//To import the environment files
import { environment } from '../../environments/environment';
//---------------------------------------------------------

const BACKEND_URL = environment.apiUrl;

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.css'],
})
export class SelectLocationComponent implements OnInit {
  options: any = {
    componentRestrictions: { country: 'IN' },
  };

  showSpinner = false;
  categories: any = [];
  currentLocation: any = '';
  public lat: any;
  public lng: any;
  public address: any;
  selecteddistance: number = 100;
  params = { latitude: 0, longitude: 0, distance: 100 };
  shortAddress: string;

  returnPage: string = undefined;

  address1: any;
  recentlyUsed: any;

  goToReturnPage() {
    if (this.returnPage === 'post-item') {
      this.router.navigate(['/post-item']);
    } else if (this.returnPage === 'home') {
      this.router.navigate(['/home'], {
        queryParams: { idVal: 'clear' },
      });
    } else {
      this.router.navigate(['/home'], {
        queryParams: { idVal: 'clear' },
      });
    }
  }

  //Go Back to previous page  Function
  goBack(): void {
    this.goBackLocation.back();
  }

  constructor(
    private locationservice: LocationService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private goBackLocation: Location
  ) {
    //Activated Route to initialize the value of Return Page
    this.route.queryParams.subscribe((params) => {
      this.returnPage = params['returnPage'];
      console.log('value of return page', this.returnPage);
    });
  }

  getSelectedLocation(address: Address) {
    console.log(address.formatted_address);
    console.log(address.geometry.location.lat());
    console.log(address.geometry.location.lng());
    this.lat = address.geometry.location.lat();
    this.address = address.formatted_address;
    this.shortAddress = address.name;
    console.log('Short Address: ', this.shortAddress);
    if (this.shortAddress) {
      localStorage.setItem('shortAddress', this.shortAddress);
    }
    this.lng = address.geometry.location.lng();
    //this.listCategories(2);
    if (this.lat && this.lng) {
      Object.assign(this.params, {
        latitude: this.lat,
        longitude: this.lng,
        address: this.address,
      });
    }
    this.locationservice.selectLocation(this.params);

    this.goBack();
  }

  recentlyUsedLocation(address: any) {
    console.log(address.latitude, address.longitude, address.address);

    this.lat = address.latitude;
    this.lng = address.longitude;
    this.address = address.address;

    if (this.lat && this.lng) {
      Object.assign(this.params, {
        latitude: this.lat,
        longitude: this.lng,
        address: this.address,
      });
    }

    this.locationservice.selectLocation(this.params);
    this.goBack();
  }

  listCategories(dist: number) {
    if (this.lat && this.lng) {
      Object.assign(this.params, {
        lattitude: this.lat,
        longitude: this.lng,
        parentCategory: 0,
      });

      this.selecteddistance = this.params.distance;
      this.categories = [];
      //this.locationservice.getProducts(this.params).subscribe((response: any) => {
      //    console.log("res:",response);
      //  this.categories =response;
      //
      //});
    } else {
      console.log('Error: No lat lon', 'Please select a location');
    }
  }

  // getCurrentLocations() {
  //   this.locationservice.getCurrentLocation();
  //   this.goToReturnPage();
  //   console.log('this.returnPage', this.returnPage);
  // }

  // getCurrentLocations() {
  //   this.showSpinner = true;
  //   this.locationservice.getCurrentLocation()
  //     .then(() => {
  //       // Simulate a 5-second delay with spinner rotation
  //       setTimeout(() => {
  //         this.showSpinner = false;
  //         this.goToReturnPage();
  //         console.log('this.returnPage', this.returnPage);
  //         // this.goBack();
  //       }, 5000);
  //     })
  //     .catch(error => {
  //       this.showSpinner = false;
  //       console.error('Error getting current location', error);
  //     });
  // }

  getCurrentLocations() {
    this.showSpinner = true;
    this.locationservice
      .getCurrentLocation()
      .then(() => {
        // Wait for the Promise to resolve before navigating
        this.showSpinner = false;
        this.goToReturnPage();
        console.log('this.returnPage', this.returnPage);
      })
      .catch((error) => {
        this.showSpinner = false;
        console.error('Error getting current location', error);
      });
  }

  ngOnInit() {
    // Retrieve the address from local storage
    this.address1 = JSON.parse(localStorage.getItem('locations')) || [];
    // Reverse the addresses array
    this.recentlyUsed = this.address1.slice().reverse();
    console.log('this.recentlyUsed', this.recentlyUsed);
  }
  /************/
  location: { latitude: number; longitude: number };
  locationName = '';

  gotoHomePage() {
    this.router.navigate(['/home'], {
      queryParams: { passedlocationName: this.locationName },
    });
    console.log('this.location ;', this.locationName);
  }
}
