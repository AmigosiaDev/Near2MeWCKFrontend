import { Component, Input, OnInit } from '@angular/core';
// import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { HttpParams } from '@angular/common/http';
import { LocationService } from './location.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common'; //Used for Back Button
//To import the environment files
import { environment } from '../../environments/environment';
/// <reference types="@types/googlemaps" />

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

//---------------------------------------------------------

const BACKEND_URL = environment.apiUrl;

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})
export class SelectLocationComponent implements OnInit {
  //------------------------------------------------------------------------------------------------------------------------
  isModalOpen = true;
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
    private locationService: LocationService,
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

  // getSelectedLocation(address: Address) {
  //   console.log(address.formatted_address);
  //   console.log(address.geometry.location.lat());
  //   console.log(address.geometry.location.lng());
  //   this.lat = address.geometry.location.lat();

  //   console.log('ADDRESS in SELECT LOCATION', address);

  //   address.address_components.forEach((component) => {
  //     console.log('COMPONENT in SELECT LOCATION:', component);
  //     // Check if the component type is "administrative_area_level_3"
  //     if (component.types.includes('administrative_area_level_3')) {
  //       //   // Get the short_name and add it to the shortAddress variable
  //       this.shortAddress = component.long_name;
  //     }
  //   });
  //   this.address = address.formatted_address;
  //   // this.shortAddress = address.name;
  //   console.log('Short Address: ', this.shortAddress);
  //   if (this.shortAddress) {
  //     localStorage.setItem('shortAddress', this.shortAddress);
  //   }
  //   this.lng = address.geometry.location.lng();
  //   //this.listCategories(2);
  //   if (this.lat && this.lng) {
  //     Object.assign(this.params, {
  //       latitude: this.lat,
  //       longitude: this.lng,
  //       address: this.address,
  //     });
  //   }
  //   this.locationservice.selectLocation(this.params);

  //   this.goBack();
  // }

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

    this.locationService.selectLocation(this.params);
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
    } else {
      console.log('Error: No lat lon', 'Please select a location');
    }
  }

  getSelectedLocation(place: google.maps.places.PlaceResult) {
    console.log(place.formatted_address);
    console.log(place.geometry.location.lat());
    console.log(place.geometry.location.lng());

    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();
    const address = place.formatted_address;

    this.locationService.selectLocation({ latitude, longitude, address });
    this.goBack();
  }

  getCurrentLocations() {
    this.showSpinner = true;
    this.locationService
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
    this.initGooglePlacesAutocomplete();
    // Retrieve the address from local storage
    this.address1 = JSON.parse(localStorage.getItem('locations')) || [];
    // Reverse the addresses array
    this.recentlyUsed = this.address1.slice().reverse();
    console.log('this.recentlyUsed', this.recentlyUsed);
  }
  /************/

  initGooglePlacesAutocomplete() {
    const inputElement = document.getElementById(
      'google-places-autocomplete'
    ) as HTMLInputElement;
    if (inputElement && google && google.maps && google.maps.places) {
      const autocomplete = new google.maps.places.Autocomplete(
        inputElement,
        this.options
      );
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          this.getSelectedLocation(place);
        }
      });
    } else {
      console.error('Google Maps API is not available');
    }
  }
  locationName = '';

  gotoHomePage() {
    this.router.navigate(['/home'], {
      queryParams: { passedlocationName: this.locationName },
    });
    console.log('this.location ;', this.locationName);
  }
}
