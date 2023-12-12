import { Component, OnInit } from '@angular/core';
import { LocationService } from '../select-location/location.service';
import { LocalStorageService } from 'angular-web-storage';
@Component({
  selector: 'app-selected-location',
  templateUrl: './selected-location.component.html',
  styleUrls: ['./selected-location.component.css'],
})
export class SelectedLocationComponent implements OnInit {
  //Declare Variables

  address: any;
  value: any;
  locationDatafromLocalStorage: any;
  constructor(
    public locationservice: LocationService,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit() {
    //To call the function that gets the selected location from location service
    this.locationservice.selectedLocation$.subscribe((locationData) => {
      console.log('Location Data is: ', locationData);
      if (locationData.address) {
        this.address = locationData.address;
      } else if (this.localStorage.get('locationData') != undefined) {
        this.address = this.localStorage.get('locationData').address;
      } else {
        this.address = 'Please Choose Location';
      }

      // this.locationDatafromLocalStorage = this.localStorage.get('locationData');
      if (
        locationData.address == undefined &&
        this.localStorage.get('locationData') == undefined
      ) {
        //to call the functon that gets the current location.
        this.locationservice.getCurrentLocation();
      }
      //--------------------------------------------RECENT LOCATION---------------------------------------
      else {
        // Retrieve existing locations from local storage
        let locations = JSON.parse(localStorage.getItem('locations')) || [];

        // Check if the new location is already present in the array
        const isDuplicate = locations.some(
          (loc) => loc.address === locationData.address
        );

        if (!isDuplicate && locationData != null) {
          // Add the new location to the array
          locations.push(locationData);
          console.log('Added location', locationData);

          // Keep only the last 5 elements in the array
          if (locations.length > 5) {
            locations = locations.slice(-5);
          }

          // Store the updated array back to local storage
          localStorage.setItem('locations', JSON.stringify(locations));
        }
      }
      //--------------------------------------------RECENT LOCATION---------------------------------------
    });
  }
}
