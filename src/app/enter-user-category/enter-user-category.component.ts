import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//To import the environment files
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl;
//SweetAlert2
import Swal from 'sweetalert2';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-enter-user-category',
  templateUrl: './enter-user-category.component.html',
  styleUrls: ['./enter-user-category.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})
export class EnterUserCategoryComponent {
  //------------------------------------Select Category Page----------------------------
  /*to scroll to the top*/
  profileID: string;
  postCategory: string = null;
  selectedCategoryID: string = null;
  categoryName: String = 'Select Category';
  selectedCategory: string = null; // Add a property to track the selected category

  constructor(private router: Router, private http: HttpClient) {}

  // Define separate arrays for residential and commercial categories
  userCategories = [
    'Seller',
    'Store',
    'Kudumbashree',
    'Homemade',
    'Farm Produce',
    'Cottage Industry',
  ];

  othersCategories = ['Kudumbashree Cloud Kitchen'];

  assignCategoryName(category: string): void {
    this.categoryName = category;
    let selectedCategoryID: string;

    switch (category) {
      case 'Seller':
        selectedCategoryID = 'ID_CAT_SEL';
        break;
      case 'Store':
        selectedCategoryID = 'ID_CAT_STO';
        break;
      case 'Kudumbashree':
        selectedCategoryID = 'ID_CAT_KUD';
        break;
      case 'Homemade':
        selectedCategoryID = 'ID_CAT_HOM';
        break;
      case 'Farm Produce':
        selectedCategoryID = 'ID_CAT_PRO';
        break;
      case 'Cottage Industry':
        selectedCategoryID = 'ID_CAT_IND';
        break;
      case 'Kudumbashree Cloud Kitchen':
        selectedCategoryID = 'ID_CAT_KCK';
        break;
      default:
        // Handle any other cases or set a default value if needed
        selectedCategoryID = 'ID_CAT_SEL';
        break;
    }

    this.postCategory = this.selectedCategoryID = selectedCategoryID;
    this.selectedCategory = category; // Update the selected category property

    console.log('selectedCategoryID', this.selectedCategoryID);
    console.log('categoryName', this.categoryName);
    console.log('postCategory:::', this.postCategory);
  }

  sendCategory() {
    if (this.selectedCategoryID) {
      this.save();
    } else {
      Swal.fire({
        title: 'Alert',
        text: 'Please enter a category to continue',
        icon: 'warning',
        confirmButtonText: 'Okay',
        confirmButtonColor: 'rgb(38 117 79)',
      });
    }
  }

  save() {
    this.profileID = localStorage.getItem('profileID');
    console.log('profileID is : ', this.profileID);

    // Send the PUT request with the user profile data and images
    this.http
      .put(BACKEND_URL + `/updateCategory/${this.profileID}`, {
        category: this.selectedCategoryID,
      })
      .subscribe(
        (response: any) => {
          console.log(response.message);
          // Handle success, if needed
          localStorage.setItem('userCategory', this.selectedCategoryID);
          Swal.fire({
            title: 'Success',
            text: 'Your Profile Category has been set successfully! 😀 ',
            icon: 'success',
            confirmButtonText: 'Okay',
            confirmButtonColor: 'rgb(38 117 79)',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/home']);
              // For more information about handling dismissals please visit
              // https://sweetalert2.github.io/#handling-dismissals
            }
          });
        },
        (error: any) => {
          console.error(error.error.message);
          Swal.fire({
            title: 'Profile update failed 🙄',
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
  }
}
