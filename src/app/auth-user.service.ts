import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
//To import the environment files
import { environment } from '../environments/environment';
const BACKEND_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  constructor(private router: Router, private http: HttpClient) {}

  authUser() {
    const token = localStorage.getItem('authToken'); //Get the token from Local Storage
    console.log('token is::::' + token);
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    const headers = new HttpHeaders({
      authorization: token, // Include the token in the Authorization header
    });
    this.http
      .get<any>(BACKEND_URL + '/login/verifyToken', { headers })
      .subscribe(
        (response) => {
          console.log(response);
          if (response.message !== 'Token is valid') {
            this.router.navigate(['/login']);
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
}
