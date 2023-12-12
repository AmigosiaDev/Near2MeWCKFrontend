import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//other imports
import { Location } from '@angular/common'; //Used for Back Button
import { ListingService } from '../listing/listing.service';

@Component({
  selector: 'app-show-all-quick-links',
  templateUrl: './show-all-quick-links.component.html',
  styleUrls: ['./show-all-quick-links.component.css'],
})
export class ShowAllQuickLinksComponent implements OnInit {
  constructor(private router: Router, private location: Location, private listingService: ListingService) {}

  selectedDistance: string;
  latitude: any;
  longitude: any;

  ngOnInit() {
    this.listingService.searchedItems=[];
    this.listingService.quickLink=[];
    this.listingService.currentPage=1;
  }
  
  //Go Back to previous page  Function

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

  goBack(): void {
    this.location.back();
  }

  /*quicklinks */
  idValue: any = '';

  gotoProductListing(event) {
    var target = event.target;
    var idAttr = target.attributes.id;
    //
    this.idValue = idAttr.nodeValue;
    //
    ////Console the value of the id
    console.log('idValue:', this.idValue);

    this.router.navigate(['listing'], {
      queryParams: {
        passedQuickLinkIdValue: this.idValue,
        checkValue4: 'quickLinks',
      },
    });
  }
}
