import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
//SweetAlert2
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
})
export class NavigationBarComponent implements OnInit {
  mobileNumber: string = null;

  ngOnInit(): void {
    this.mobileNumber = this.localStorage.get('passedPhoneNumber');
  }

  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  home() {
    localStorage.setItem('scrollPosition', '0'); //Set the scroll position on homepage to 0
    this.router.navigate(['/home']);
  }

  notifications() {
    this.router.navigate(['/notifications']);
  }

  goToPost() {
    Swal.fire({
      title: 'Note!',
      text: 'Before posting, please ensure that the selected location is correct. ',
      icon: 'info',

      confirmButtonText: 'Okay',
      confirmButtonColor: 'rgb(38 117 79)',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/post-item']);
      }
    });
  }

  goToFav() {
    this.router.navigate(['/favourites']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }
}
