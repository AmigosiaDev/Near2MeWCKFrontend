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
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})
export class FaqComponent {
  constructor(private location: Location) {}
  //Go Back to previous page Function
  goBack(): void {
    this.location.back();
    // this.router.navigate(['/listing']);
  }
}
