import { Component } from '@angular/core';
import { Location } from '@angular/common'; //Used for Back Button

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FaqComponent {
  constructor(private location: Location) {}
  //Go Back to previous page Function
  goBack(): void {
    this.location.back();
    // this.router.navigate(['/listing']);
  }
}
