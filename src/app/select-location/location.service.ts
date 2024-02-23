import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl;
const googleMapsAPIKey = environment.googleMapsAPIKey;

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(
    private _http: HttpClient,
    private localStorage: LocalStorageService,
    private router: Router
  ) {}

  public latitude: number;
  public longitude: number;
  public address: any = null;
  public dataResponse: any;
  public locationData = [];
  public shortAddress: string = null;
  private locationObject$ = new BehaviorSubject<any>({});
  public selectedLocation$ = this.locationObject$.asObservable();
  locationDetails = new Object();

  async getCurrentLocation(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.locationDetails['latitude'] = latitude;
            this.locationDetails['longitude'] = longitude;
            this.setCurrentLocation(position).subscribe((response: any) => {
              this.locationDetails['address'] =
                response.results[1].formatted_address;
              this.selectLocation(this.locationDetails);
              console.log('Response Results:', response.results);
              console.log('address[0]', response.results[0].formatted_address);
              console.log('address[1]', response.results[1].formatted_address);
              console.log('address[2]', response.results[2].formatted_address);
              console.log('address[3]', response.results[3].formatted_address);
              console.log('address[4]', response.results[4].formatted_address);
              console.log('address[5]', response.results[5].formatted_address);
              console.log('address[6]', response.results[6].formatted_address);

              // Split the address by commas and get the first part
              // const addressParts = formattedAddress.split(',');
              // const city = addressParts[0].trim(); // Trim to remove leading/trailing spaces

              // Assign the city to this.shortAddress
              // this.shortAddress = city;

              // Iterate through each result in the response
              response.results.forEach((result) => {
                // Iterate through the address components in each result
                result.address_components.forEach((component) => {
                  console.log('COMPONENT:', component);
                  // Check if the component type is "administrative_area_level_3"
                  if (component.types.includes('administrative_area_level_3')) {
                    //   // Get the short_name and add it to the shortAddress variable
                    this.shortAddress = component.long_name;
                  }
                });
              });

              // Trim any extra whitespace at the end
              // this.shortAddress = this.shortAddress.trim();

              // // Now, shortAddress contains the short names of administrative_area_level_3 components
              console.log(this.shortAddress);

              console.log('the short address is ', this.shortAddress);

              if (this.shortAddress) {
                localStorage.setItem('shortAddress', this.shortAddress);
              }

              console.log('locationDetails', this.locationDetails);
              resolve();
            });
          },
          (error) => {
            console.log('The error is', error);
            this.router.navigate(['/select-location']);
            Swal.fire({
              title: 'Location unavailable.',
              text: 'Please turn on your device location or select your preferred location to continue',
              icon: 'info',
              confirmButtonText: 'Okay',
              confirmButtonColor: 'rgb(38 117 79)',
            }).then((result) => {
              if (result.isConfirmed) {
                console.log('Result confirmed');
                this.handleDefaultLocation();
                resolve();
              }
            });
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
        reject('Geolocation not supported');
      }
    });
  }

  private handleDefaultLocation() {
    if (localStorage.getItem('locations')) {
      let recentAddress: any = localStorage.getItem('locations');
      recentAddress = JSON.parse(recentAddress);

      const defaultLatitude = recentAddress[recentAddress.length - 1].latitude;
      const defaultLongitude =
        recentAddress[recentAddress.length - 1].longitude;

      this.locationDetails['latitude'] = defaultLatitude;
      this.locationDetails['longitude'] = defaultLongitude;
      this.locationDetails['address'] =
        recentAddress[recentAddress.length - 1].address;

      this.selectLocation(this.locationDetails);
      this.localStorage.set('locationData', this.locationDetails);
      this.router.navigate(['/home']);
    } else {
      const defaultLatitude = 10.7657522;
      const defaultLongitude = 76.695113;

      this.locationDetails['latitude'] = defaultLatitude;
      this.locationDetails['longitude'] = defaultLongitude;
      this.locationDetails['address'] =
        'Polytechnic Bus Stop, Palakkad - Pollachi Rd, Kodumba, Palakkad, Kerala 678007, India';

      this.selectLocation(this.locationDetails);
      this.localStorage.set('locationData', this.locationDetails);
      this.router.navigate(['/home']);
    }
  }

  public setCurrentLocation(position: any): Observable<any> {
    const { latitude, longitude } = position.coords;
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsAPIKey}&libraries=places&language=en`;
    return this._http.get(geocodingUrl);
  }

  public selectLocation(param: any) {
    this.latitude = param.latitude;
    this.longitude = param.longitude;
    this.address = param.address;
    this.locationData = param;
    this.locationObject$.next(this.locationData);
    console.log('the location data in location service :', this.locationData);
    this.localStorage.set('locationData', this.locationData);

    let selectedLoc = this.localStorage.get('locationData');
    console.log('selectedLocation in Local Storage: ', selectedLoc);
  }
}
