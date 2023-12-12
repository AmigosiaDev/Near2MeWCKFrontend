import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //Used for  HTTP Get Request
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthUserService } from '../auth-user.service';
//SweetAlert2
import Swal from 'sweetalert2';
//To import the environment files
import { environment } from '../../environments/environment';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

const BACKEND_URL = environment.apiUrl;

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})
export class FavouritesComponent implements OnInit {
  favouritesArray = [];
  dataBaseId: string;
  clearId: string;
  profileID: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe,
    private AuthUserService: AuthUserService
  ) {}

  ngOnInit(): void {
    //To Check Authentication
    if (localStorage.getItem('isLoggedIn') == 'true') {
      this.profileID = localStorage.getItem('profileID');
      this.getAllFavourites(this.profileID);
    }
    this.AuthUserService.authUser();
  }

  imageURL: any;

  // getAllFavourites(profileID: string) {
  //   const url = BACKEND_URL + `/favSearch/${profileID}`;
  //   this.http.get(url).subscribe((productData: any) => {
  //     this.favouritesArray = productData;
  //     console.log('favouritesArray is: ', this.favouritesArray);

  //     this.favouritesArray = productData.map((product: any) => {
  //       return {
  //         ...product,
  //         date: this.formatDate(product.date), // Format the date
  //       };
  //     });
  //   });
  // }

  getAllFavourites(profileID: string) {
    const url = BACKEND_URL + `/favSearch/${profileID}`;

    this.http.get(url).subscribe(
      (response: any) => {
        this.favouritesArray = response.combinedFavorites;
        console.log('Favourites array: ', this.favouritesArray);

        // If needed, you can format the date here as you've shown in your code
        this.favouritesArray = this.favouritesArray.map((product: any) => {
          return {
            ...product,
            date: this.formatDate(product.date), // Format the date
          };
        });
      },
      (error: any) => {
        console.error('Error:', error);
        // Handle error as needed
      }
    );
  }

  formatDate(date: string): string {
    const formattedDate = this.datePipe.transform(date, 'dd-MM-yyyy');
    return formattedDate || '';
  }

  goToDescription(clickedID, profileID) {
    console.log('Clicked ID:', clickedID);
    if (clickedID) {
      this.dataBaseId = clickedID;
      console.log('the dataBaseId is:', this.dataBaseId);
      this.router.navigate(['/description'], {
        queryParams: {
          passedDataBaseId: this.dataBaseId,
          profileID: profileID,
          checkValue5: 'fav',
          isIconBackgroundToggled: true,
        },
      });
    } else {
      this.goToSellerDetails(profileID);
    }
  }

  goToSellerDetails(profileID: number) {
    console.log('seller details clicked', profileID);
    this.router.navigate(['/seller-details'], {
      queryParams: {
        profileID: profileID,
        checkValue5: 'fav',
        isIconBackgroundToggled: true,
      },
    });
  }

  favouritesDelete(favData: any) {
    if (favData.productID) {
      this.clearId = favData.productID;
    } else if (favData.serviceID) {
      this.clearId = favData.serviceID;
    } else if (favData.profileID) {
      this.clearId = favData.profileID;
    }

    this.http
      .delete(BACKEND_URL + '/deleteFav/' + this.clearId + '/' + this.profileID)
      .subscribe(
        (response) => {
          Swal.fire({
            title: 'Removed from favourites',
            text: '',
            icon: 'info',

            confirmButtonText: 'Okay',
            confirmButtonColor: 'rgb(38 117 79)',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
              // For more information about handling dismissals please visit
              // https://sweetalert2.github.io/#handling-dismissals
            }
          });
        },
        (error) => {
          Swal.fire({
            title: 'Failed to remove from favourites🙄',

            icon: 'error',

            confirmButtonText: 'Okay',
            confirmButtonColor: 'rgb(38 117 79)',
          }).then((result) => {
            if (result.isConfirmed) {
              // For more information about handling dismissals please visit
              // https://sweetalert2.github.io/#handling-dismissals
            }
          });
        }
      );
    this.getAllFavourites(this.profileID);
  }

  getStyles(userCategory: string): any {
    switch (userCategory) {
      case 'ID_CAT_KUD':
        return { 'background-color': '#DBDFEA' };
      case 'ID_CAT_STO':
        return { 'background-color': '#E4D0D0' };
      case 'ID_CAT_HOM':
        return { 'background-color': '#FAEDCD' };
      case 'ID_CAT_PRO':
        return { 'background-color': '#C7E9B0' };
      case 'ID_CAT_IND':
        return { 'background-color': '#DBE4C6' };
      default:
        return '';
    }
  }

  getUserCategory(userCategory: string) {
    switch (userCategory) {
      case 'ID_CAT_STO':
        return 'Store';
      case 'ID_CAT_KUD':
        return 'Kudumbasree';
      case 'ID_CAT_HOM':
        return 'Homemade';
      case 'ID_CAT_PRO':
        return 'Farm Produce';
      case 'ID_CAT_IND':
        return 'Cottage Industry';
      default:
        return 'Seller';
    }
  }

  serviceCategory(serviceCategory: string) {
    switch (serviceCategory) {
      case 'ID_FRM':
        return 'Farm Services';
      case 'ID_SKL':
        return 'Skilled Services';
      case 'ID_LLE':
        return 'Local Events';
      case 'ID_OTH':
        return 'Other Services';
      default:
        return '';
    }
  }
}
