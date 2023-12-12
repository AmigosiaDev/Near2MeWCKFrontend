import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
//For Notification
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
//To import the environment files
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl;
const vapidKey = environment.firebase.vapidKey;
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = BACKEND_URL + '/notifications';
  //notifications- updating browserToken of loggedIn user
  sellerId: string = '';
  message: any;

  storedProfileID: any;
  isLoggedIn: any;
  browserToken: string = '';
  constructor(private http: HttpClient, private router: Router) {}

  getNotificationsByProfileID(profileID: string): Observable<any> {
    const url = `${this.apiUrl}/${profileID}`; // Append the profileID to the URL
    return this.http.get<any>(url);
  }

  updateToken() {
    const storedProfileID = localStorage.getItem('profileID');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    console.log('hi', storedProfileID, isLoggedIn);
    if (isLoggedIn && storedProfileID) {
      console.log('hi2');

      const formData = new FormData();
      formData.append('profileID', storedProfileID);
      formData.append('browserToken', this.browserToken);
      this.http.post(BACKEND_URL + '/sellers/updateToken', formData).subscribe(
        (response) => {
          console.log('Token updated:', response);
          // Handle success response here
        },
        (error) => {
          console.error('Failed to update token:', error);
          // Handle error response here
        }
      );
    }
  }

  requestPermission() {
    console.log('1');
    const messaging = getMessaging();

    getToken(messaging, { vapidKey: vapidKey })
      .then((currentToken) => {
        console.log('Tokeed:', currentToken);
        if (currentToken) {
          console.log('Hurraaa!!! we got the token.....');
          this.browserToken = currentToken;
          console.log(currentToken);

          this.updateToken();
          console.log('Token updated');
          // Send the token to your server and update the UI if necessary
          // ...
        } else {
          // Show permission request UI
          console.log(
            'No registration token available. Request permission to generate one.'
          );
          // ...
        }
      })
      .catch((err) => {
        // console.log('An error occurred while retrieving token. ', err);
        // ...
      });
  }
  // listen() {
  //   const messaging = getMessaging();
  //   onMessage(messaging, (payload) => {
  //     console.log('Message received. ', payload);
  //     this.message = payload;
  //   });
  // }

  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message = payload;
    });
  }
}
