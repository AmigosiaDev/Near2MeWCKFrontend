// import { Injectable } from '@angular/core';
// //other imports
// import { HttpClient } from '@angular/common/http';
// import { LocalStorageService } from 'angular-web-storage';

// import { Router } from '@angular/router';

// import { Observable, BehaviorSubject, Subject } from 'rxjs';
// //To import the environment files
// import { environment } from '../../environments/environment';
// //SweetAlert2
// import Swal from 'sweetalert2';
// const BACKEND_URL = environment.apiUrl;
// const googleMapsAPIKey = environment.googleMapsAPIKey;

// @Injectable({
//   providedIn: 'root',
// })
// export class LocationService {
//   constructor(
//     private _http: HttpClient,
//     private localStorage: LocalStorageService,
//     private router: Router
//   ) {}

//   public latitude: number;
//   public longitude: number;
//   public address: any = null;
//   public dataResponse: any;

//   public locationData = [];

//   //To Pass address
//   private locationObject$ = new BehaviorSubject<any>({}); //Declaring a subject to pass address
//   public selectedLocation$ = this.locationObject$.asObservable(); //Converting the subject as observables

//   //Declare Variables
//   locationDetails = new Object();

//   //Definition of delay function uses setTimeout function
//   // delay(ms: number): Promise<void> {
//   //   return new Promise<void>((resolve) => setTimeout(resolve, ms));
//   // }

//   async getCurrentLocation() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           this.locationDetails['latitude'] = latitude;
//           this.locationDetails['longitude'] = longitude;
//           this.setCurrentLocation(position).subscribe((response: any) => {
//             this.locationDetails['address'] =
//               response.results[1].formatted_address;
//             this.selectLocation(this.locationDetails);
//             console.log('locationDetails', this.locationDetails);
//           });
//         },
//         (error) => {
//           console.log('The error is', error);
//           this.router.navigate(['/select-location']);
//           Swal.fire({
//             title: 'Location unavailable.',
//             text: 'Please turn on your device location or select your preferred location to continue',
//             icon: 'info',

//             confirmButtonText: 'Okay',
//             confirmButtonColor: 'rgb(38 117 79)',
//           }).then((result) => {
//             if (result.isConfirmed) {
//               console.log('Result confirmed');
//               if (localStorage.getItem('locations')) {
//                 let recentAddress: any = localStorage.getItem('locations');
//                 recentAddress = JSON.parse(recentAddress);
//                 // console.log(recentAddress[0].address)
//                 const defaultLatitude =
//                   recentAddress[recentAddress.length - 1].latitude; // Example latitude for the default location
//                 const defaultLongitude =
//                   recentAddress[recentAddress.length - 1].longitude; // Example longitude for the default location

//                 this.locationDetails['latitude'] = defaultLatitude;
//                 this.locationDetails['longitude'] = defaultLongitude;
//                 this.locationDetails['address'] =
//                   recentAddress[recentAddress.length - 1].address;
//                 this.selectLocation(this.locationDetails);
//                 console.log('locationDetails', this.locationDetails);
//                 // Save the default location to localStorage or perform any other necessary actions
//                 this.localStorage.set('locationData', this.locationDetails);

//                 // Continue with the rest of your logic or navigation
//                 this.router.navigate(['/home']);
//               } else {
//                 const defaultLatitude = 10.7657522; // Example latitude for the default location
//                 const defaultLongitude = 76.695113; // Example longitude for the default location

//                 this.locationDetails['latitude'] = defaultLatitude;
//                 this.locationDetails['longitude'] = defaultLongitude;
//                 this.locationDetails['address'] =
//                   'Polytechnic Bus Stop, Palakkad - Pollachi Rd, Kodumba, Palakkad, Kerala 678007, India';
//                 this.selectLocation(this.locationDetails);
//                 console.log('locationDetails', this.locationDetails);
//                 // Save the default location to localStorage or perform any other necessary actions
//                 this.localStorage.set('locationData', this.locationDetails);

//                 // Continue with the rest of your logic or navigation
//                 this.router.navigate(['/home']);
//               }
//             }
//           });
//         }
//       );
//     } else {
//       alert('Geolocation is not supported by this browser.');
//     }
//   }

//   public setCurrentLocation(position: any) {
//     const { latitude, longitude } = position.coords;
//     const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsAPIKey}&libraries=places&language=en`;
//     console.log('DataResponse', this.dataResponse);
//     return (this.dataResponse = this._http.get(geocodingUrl));
//   }

//   public selectLocation(param: any) {
//     this.latitude = param.latitude;
//     this.longitude = param.longitude;
//     this.address = param.address;
//     this.locationData = param;
//     this.locationObject$.next(this.locationData);

//     // Store the LocationData in LocalStorage
//     this.localStorage.set('locationData', this.locationData);
//     let selectedLoc = this.localStorage.get('locationData');
//     console.log('selectedLocation in Local Storage: ', selectedLoc);
//   }
// }

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
    this.localStorage.set('locationData', this.locationData);
 
    let selectedLoc = this.localStorage.get('locationData');
    console.log('selectedLocation in Local Storage: ', selectedLoc);
  }
}
