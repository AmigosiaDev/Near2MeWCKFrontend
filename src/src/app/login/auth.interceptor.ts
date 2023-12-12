import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}
  authToken:string;
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith('https://maps.googleapis.com')){
    console.log('Intercepted!', request);
    if (window.localStorage.getItem('authToken'))
     this.authToken = window.localStorage.getItem('authToken');
    const copiedReq = request.clone({
      headers: request.headers.set(
        'authorization', 'Bearer ' + this.authToken
      )
    });
    
    return next.handle(copiedReq).pipe( tap({     
      error: (err) => {        
        if (err instanceof HttpErrorResponse) {
          console.log(err.status)
          if (err.status !== 401) {
           return;
          }
          this.router.navigate(['/login']);
        }
       
      }
      
    }))
  }else{
    return next.handle(request)
  }}
}
