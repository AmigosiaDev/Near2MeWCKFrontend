import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class VerifyPhoneNumberService {
  constructor(private _http: HttpClient) {}

  getTimer(phoneNumber) {
    return this._http.post(
      BACKEND_URL + '/login/getotp',
      { mobile: phoneNumber },
      {
        responseType: 'json',
      }
    );
  }

  verify(phoneNumber, otp, profileID, date) {
    return this._http.post(
      BACKEND_URL + '/login/verify',
      { mobile: phoneNumber, otp: otp, profileID: profileID, date: date },
      {
        responseType: 'json',
      }
    );
  }

  saveName(name, profileID) {
    return this._http.post(
      BACKEND_URL + '/login/saveName',
      { username: name, profileID: profileID   },
      {
        responseType: 'json',
      }
    );
  }
}
