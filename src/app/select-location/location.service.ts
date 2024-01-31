import { Injectable } from '@angular/core';
//other imports
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
//To import the environment files
import { environment } from '../../environments/environment';
//SweetAlert2
import Swal from 'sweetalert2';
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

  //To Pass address
  private locationObject$ = new BehaviorSubject<any>({}); //Declaring a subject to pass address
  public selectedLocation$ = this.locationObject$.asObservable(); //Converting the subject as observables

  //Declare Variables
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
            // Customize SweetAlert with a dropdown menu

            if (localStorage.getItem('locations')) {
              this.handleDefaultLocation();
            } else {
              const selectLocationDropdown = `
                        <select style="border-radius:10px" id="location-dropdown" class="swal2-select">
                            <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                            <option value="Kollam">Kollam</option>
                            <option value="Alappuzha">Alappuzha</option>
                            <option value="Pathanamthitta">Pathanamthitta</option>
                            <option value="Kottayam">Kottayam</option>
                            <option value="Idukki">Idukki</option>
                            <option value="Ernakulam">Ernakulam</option>
                            <option value="Thrissur">Thrissur</option>
                            <option value="Palakkad">Palakkad</option>
                            <option value="Malappuram">Malappuram</option>
                            <option value="Kozhikode">Kozhikode</option>
                            <option value="Wayanad">Wayanad</option>
                            <option value="Kannur">Kannur</option>
                            <option value="Kasaragod">Kasaragod</option>
                        </select>
                    `;
              Swal.fire({
                title: 'Location unavailable.',
                html: `
                            <p>Please turn on your device location or select your preferred location to continue:</p>
                            ${selectLocationDropdown}
                        `,
                icon: 'info',
                allowOutsideClick: () => !Swal.isLoading(), // Prevent outside click when loading
                confirmButtonText: 'Okay',
                confirmButtonColor: 'rgb(38 117 79)',
              }).then((result) => {
                if (result.isConfirmed) {
                  console.log('Result confirmed');
                  const selectedLocation = (
                    document.getElementById(
                      'location-dropdown'
                    ) as HTMLSelectElement
                  ).value;
                  this.handleSelectedLocation(selectedLocation);
                  resolve();
                } else if (
                  result.dismiss === Swal.DismissReason.backdrop ||
                  result.dismiss === Swal.DismissReason.esc
                ) {
                  // If dismissed by clicking outside or pressing Esc, set default location to Thiruvananthapuram
                  this.handleSelectedLocation('Thiruvananthapuram');
                  resolve();
                }
              });
            }
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
        reject('Geolocation not supported');
      }
    });
  }

  handleSelectedLocation(selectedLocation: string): void {
    console.log('Selected Location:', selectedLocation);

    switch (selectedLocation) {
      case 'Thiruvananthapuram':
        this.locationDetails['address'] = 'Thiruvananthapuram, Kerala, India';
        this.locationDetails['latitude'] = 8.5241391;
        this.locationDetails['longitude'] = 76.9366376;
        break;
      case 'Kollam':
        this.locationDetails['address'] = 'Kollam, Kerala, India';
        this.locationDetails['latitude'] = 8.8932118;
        this.locationDetails['longitude'] = 76.6141396;
        break;
      case 'Alappuzha':
        this.locationDetails['address'] = 'Alappuzha, Kerala, India';
        this.locationDetails['latitude'] = 9.498066699999999;
        this.locationDetails['longitude'] = 76.3388484;
        break;
      case 'Pathanamthitta':
        this.locationDetails['address'] = 'Pathanamthitta, Kerala, India';
        this.locationDetails['latitude'] = 9.2647582;
        this.locationDetails['longitude'] = 76.78704139999999;
        break;
      case 'Kottayam':
        this.locationDetails['address'] = 'Kottayam, Kerala, India';
        this.locationDetails['latitude'] = 9.591566799999999;
        this.locationDetails['longitude'] = 76.5221531;
        break;
      case 'Idukki':
        this.locationDetails['address'] = 'Idukki, Kerala, India';
        this.locationDetails['latitude'] = 9.813807599999999;
        this.locationDetails['longitude'] = 76.9297354;
        break;
      case 'Ernakulam':
        this.locationDetails['address'] = 'Ernakulam, Kerala, India';
        this.locationDetails['latitude'] = 9.9816358;
        this.locationDetails['longitude'] = 76.2998842;
        break;

      case 'Thrissur':
        this.locationDetails['address'] = 'Thrissur, Kerala, India';
        this.locationDetails['latitude'] = 10.5276416;
        this.locationDetails['longitude'] = 76.2144349;
        break;
      case 'Palakkad':
        this.locationDetails['address'] = 'Palakkad, Kerala, India';
        this.locationDetails['latitude'] = 10.7867303;
        this.locationDetails['longitude'] = 76.6547932;
        break;

      case 'Malappuram':
        this.locationDetails['address'] = 'Malappuram, Kerala, India';
        this.locationDetails['latitude'] = 11.0509762;
        this.locationDetails['longitude'] = 76.0710967;
        break;
      case 'Kozhikode':
        this.locationDetails['address'] = 'Kozhikode, Kerala, India';
        this.locationDetails['latitude'] = 11.2587531;
        this.locationDetails['longitude'] = 75.78041;
        break;
      case 'Wayanad':
        this.locationDetails['address'] = 'Wayanad, Kerala, India';
        this.locationDetails['latitude'] = 11.703206;
        this.locationDetails['longitude'] = 76.0833999;
        break;
      case 'Kannur':
        this.locationDetails['address'] = 'Kannur, Kerala, India';
        this.locationDetails['latitude'] = 11.8744775;
        this.locationDetails['longitude'] = 75.37036619999999;
        break;
      case 'Kasaragod':
        this.locationDetails['address'] = 'Kasaragod, Kerala, India';
        this.locationDetails['latitude'] = 12.4995966;
        this.locationDetails['longitude'] = 74.9869276;
        break;
      default:
        console.log('Location not handled:', selectedLocation);
        break;
    }
    this.handleDefaultLocation();
    // Further handling logic based on the selected location
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
      // const defaultLatitude = 10.7657522;
      // const defaultLongitude = 76.695113;

      // this.locationDetails['latitude'] = defaultLatitude;
      // this.locationDetails['longitude'] = defaultLongitude;
      // this.locationDetails['address'] =
      //   'Polytechnic Bus Stop, Palakkad - Pollachi Rd, Kodumba, Palakkad, Kerala 678007, India';

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
