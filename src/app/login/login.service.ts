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
export class LoginService {
  constructor(private _http: HttpClient) {}

  mobileLogin(newUserPhoneNumber) {
    //Auth Bypass for Nizam Wattlecorp
    if (newUserPhoneNumber == 7034629231) {
      return this._http.post(
        BACKEND_URL + '/login/auth',
        { mobile: newUserPhoneNumber },
        {
          responseType: 'json',
        }
      );
    } else {
      return this._http.post(
        BACKEND_URL + '/login/authBypass',
        { mobile: newUserPhoneNumber },
        {
          responseType: 'json',
        }
      );
    }
  }
}
