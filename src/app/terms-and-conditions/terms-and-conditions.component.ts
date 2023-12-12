import { Component } from '@angular/core';
import { Location } from '@angular/common'; //Used for Back Button

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent {
  constructor(private location:Location){}
  goBack(): void {
    this.location.back();
    }
}
