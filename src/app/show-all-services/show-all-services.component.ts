import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
//other imports
import { Location } from '@angular/common'; //Used for Back Button
import { ListingService } from '../listing/listing.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-show-all-services',
  templateUrl: './show-all-services.component.html',
  styleUrls: ['./show-all-services.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})
export class ShowAllServicesComponent implements OnInit {
  //We initialize the variables for ID
  serviceIdValue: any = '';

  constructor(
    private router: Router,
    private location: Location,
    private listingService: ListingService
  ) {}

  selectedDistance: string;
  latitude: any;
  longitude: any;

  ngOnInit(): void {
    this.listingService.searchedItems = [];
    this.listingService.quickLink = [];
    this.listingService.currentPage = 1;
  }
  //Go Back to previous page  Function

  getFontClass(): string {
    const currentLanguage = localStorage.getItem('setLanguage');

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
  goBack(): void {
    this.location.back();
  }

  gotoServiceListing(event) {
    //---------------------------------FOR getting ID-------------------------------
    //We shall pass the $event variable and access the id property via the current target.
    var target = event.target;
    var idAttr = target.attributes.id;

    this.serviceIdValue = idAttr.nodeValue;

    //Console the value of the id
    console.log('service ID Value:', this.serviceIdValue);
    //--------------------------------Using QueryParams------------------------------
    //We pass the value through the routerlink using queryparams
    this.router.navigate(['listing'], {
      queryParams: {
        passedServiceCategoryIdValue: this.serviceIdValue,
        checkValue3: 'service',
      },
    });
  }
}
