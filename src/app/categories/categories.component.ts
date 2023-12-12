import { Component, OnInit } from '@angular/core';
//other imports
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ListingService } from '../listing/listing.service';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  /*to scroll to the top*/
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectedTab: string;
  latitude: number;
  longitude: number;
  selectedDistance: number;
  ngOnInit() {
    this.listingService.currentPage=1;
    this.listingService.quickLink=[]
    this.listingService.searchedItems=[];
    //-------------------------------ACTIVATED ROUTES for receiving query params when clicked on a category group.-------------------------------
    this.route.queryParams.subscribe((params) => {
      this.selectedTab = params['group'];
      console.log('Selected Tab is', this.selectedTab);
    });
    this.scrollToTop();
    //-------------------------------ACTIVATED ROUTES for receiving query params when clicked on a category group ends.-------------------------------
  }

  //Go Back to previous page  Function

  //We initialize the variables for ID
  idValue: any = '';

  //We add a constructor function for HTTPCLient
  constructor(private router: Router, private route: ActivatedRoute, private listingService:ListingService) {}

  selectTab(tabName) {
    this.selectedTab = tabName;
    console.log('Selected Tab is: ', this.selectedTab);
    this.router.navigate([], {
      queryParams: {
        group: tabName,
      },
    });
    this.scrollToTop();
  }

  //Definition of gotoProductListing function where $even is passed
  gotoProductListing(event) {
    //---------------------------------FOR getting ID-------------------------------
    //We shall pass the $event variable and access the id property via the current target.
    var target = event.target;
    var idAttr = target.attributes.id;
    this.idValue = idAttr.nodeValue;
    //Console the value of the id
    console.log('idValue:', this.idValue);
    //We pass the value through the routerlink using queryparams
    this.router.navigate(['/listing'], {
      queryParams: {
        passedCategoryIdValue: this.idValue,
        checkValue2: 'product',
      },
    });
  }

  getFontClass(): string {
    const currentLanguage = localStorage.getItem("setLanguage");

    switch (currentLanguage) {
      case 'en':
        return 'en-font';
      case 'ml':
        return 'ml-font';
      case 'tl':
        return 'tl-font'
      // Handle other languages...
      default:
        return 'en-font'; // Default font size class
    }
  }
}
