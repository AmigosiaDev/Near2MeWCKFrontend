import { Component } from '@angular/core';
import { Location } from '@angular/common'; //Used for Back Button
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})
export class TermsAndConditionsComponent {
  constructor(private location: Location) {}
  goBack(): void {
    this.location.back();
  }
}
