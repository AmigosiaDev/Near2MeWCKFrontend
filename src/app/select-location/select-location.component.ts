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
  showSpinner = false;
  categories: any = [];
  currentLocation: any = '';
  selectedDistance: number = 100;
  params = { latitude: 0, longitude: 0, distance: 100 };

  returnPage: string = undefined;
  recentlyUsed: any[];
  options: any = {
    componentRestrictions: { country: 'IN' },
  };
  constructor(
    private locationService: LocationService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private goBackLocation: Location
  ) {
    this.route.queryParams.subscribe((params) => {
      this.returnPage = params['returnPage'];
    });
  }

  ngOnInit() {
    this.initGooglePlacesAutocomplete();
    this.recentlyUsed = JSON.parse(localStorage.getItem('locations')) || [];
    this.recentlyUsed.reverse();
  }
  openModal() {
    this.isModalOpen = true;
  }

  hideModal() {
    this.isModalOpen = false;
    // this.clearForm();
  }

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

  goToReturnPage() {
    if (this.returnPage === 'post-item') {
      this.router.navigate(['/post-item']);
    } else {
      this.router.navigate(['/home'], {
        queryParams: { idVal: 'clear' },
      });
    }
  }

  goBack(): void {
    this.goBackLocation.back();
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

  recentlyUsedLocation(address: any) {
    this.locationService.selectLocation(address);
    this.goBack();
  }

  listCategories(dist: number) {
    // Your logic for listing categories based on distance
  }

  getCurrentLocation() {
    this.showSpinner = true;
    this.locationService
      .getCurrentLocation()
      .then(() => {
        this.showSpinner = false;
        this.goToReturnPage();
      })
      .catch((error) => {
        this.showSpinner = false;
        console.error('Error getting current location', error);
      });
  }

  location: { latitude: number; longitude: number };
  locationName = '';

  gotoHomePage() {
    this.router.navigate(['/home'], {
      queryParams: { passedlocationName: this.locationName },
    });
    console.log('this.location ;', this.locationName);
  }

  selectLocation(selectedLocation: string) {
    this.locationService.handleSelectedLocation(selectedLocation);
  }
}
