import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css'],
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
