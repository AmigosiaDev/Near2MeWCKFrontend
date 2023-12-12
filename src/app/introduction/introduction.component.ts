import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})
export class IntroductionComponent implements OnInit {
  doNotShowIntroduction: boolean;

  constructor(private router: Router) {}
  ngOnInit() {
    //   Check the value of showIntroduction in local storage
    const storedValue = localStorage.getItem('doNotShowIntroduction');
    if (storedValue === 'true') {
      this.router.navigate(['/home']); // Navigate to the homepage if showIntroduction is true
    } else {
      this.doNotShowIntroduction = false;
    }
  }

  dismissIntroduction() {
    if (!this.doNotShowIntroduction) {
      localStorage.setItem('doNotShowIntroduction', 'false');
    } else {
      localStorage.setItem('doNotShowIntroduction', 'true');
    }
    this.router.navigate(['/home']); // Navigate to the main app after introduction
  }
}
