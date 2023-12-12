import { Component, OnInit } from '@angular/core';
//other Imports
import { Router } from '@angular/router';
import { Location } from '@angular/common'; //Used for Back Button

@Component({
  selector: 'app-show-all-products',
  templateUrl: './show-all-products.component.html',
  styleUrls: ['./show-all-products.component.css'],
})
export class ShowAllProductsComponent implements OnInit {
  constructor(private router: Router, private location: Location) {}

  selectedDistance: string;
  latitude: any;
  longitude: any;

  ngOnInit() {}

  getFontClass(): string {
    const currentLanguage = localStorage.getItem("setLanguage");

    switch (currentLanguage) {
      case 'en':
        return 'en-font';
      case 'ml':
        return 'ml-font';
      // Handle other languages...
      default:
        return 'en-font'; // Default font size class
    }
  }

  //Go Back to previous page  Function
  goBack(): void {
    this.location.back();
  }

  //-------------------------------Going to Listing Page---------------------------------
  goToCategories(categoryGroup: string) {
    this.router.navigate(['/categories'], {
      queryParams: { group: categoryGroup },
    });
  }
  //-------------------------------Going to Listing Page---------------------------------
}
