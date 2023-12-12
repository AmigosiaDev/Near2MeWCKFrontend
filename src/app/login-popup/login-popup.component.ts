import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})
export class LoginPopupComponent {
  constructor(private router: Router) {}
  showModal = false;
  lastShownTimeKey = 'lastShownTime';
  isLoggedIn = null; // Check the isLoggedIn value in your actual implementation
  storedLanguage = null;
  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn');
    this.storedLanguage = localStorage.getItem('setLanguage');
    this.checkShowModal();
    console.log(this.isLoggedIn, 'sdhfsdhfdsahf;osadhfisdahfi');
  }

  checkShowModal() {
    const lastShownTime = localStorage.getItem(this.lastShownTimeKey);

    if (
      !this.isLoggedIn &&
      (!lastShownTime ||
        Date.now() - Number(lastShownTime) >= 12 * 60 * 60 * 1000) &&
      this.storedLanguage
    ) {
      this.showModal = true;
    }
  }

  onClose() {
    this.showModal = false;
    // Update the last shown time in local storage
    localStorage.setItem(this.lastShownTimeKey, Date.now().toString());
  }

  onOk() {
    localStorage.setItem(this.lastShownTimeKey, Date.now().toString());

    this.showModal = false;
    this.router.navigate(['/login']);
    // Perform any action when the user clicks "OK"
    // For example, you might want to redirect the user to the signup page
  }
}
