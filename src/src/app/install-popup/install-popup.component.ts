import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PwaService } from '../pwa.service'; // Import the PwaService
//SweetAlert2
import Swal from 'sweetalert2';
declare global {
  interface BeforeInstallPromptEvent extends Event {
    userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
    }>;
    readonly platforms: string[];
    prompt(): Promise<void>;
  }
}

@Component({
  selector: 'app-install-popup',
  templateUrl: './install-popup.component.html',
  styleUrls: ['./install-popup.component.css'],
})
export class InstallPopupComponent implements OnInit {
  deferredPrompt: BeforeInstallPromptEvent;

  constructor(private router: Router, public pwaService: PwaService) {
    //Event listener to handle PWA installation prompt
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      // Prevent the default prompt from appearing
      event.preventDefault();
      // Store the deferred prompt event
      this.deferredPrompt = event as BeforeInstallPromptEvent;
    });
  }
  showModal = false;
  lastShownTimeKey = 'lastInstallShownTime';

  ngOnInit(): void {
    this.checkShowModal();
    console.log(this.lastShownTimeKey);
  }

  checkShowModal() {
    const lastInstallShownTime = localStorage.getItem(this.lastShownTimeKey);

    if (
      this.deferredPrompt ||
      !lastInstallShownTime ||
      Date.now() - Number(lastInstallShownTime) >= 1 * 60 * 60 * 1000
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
    this.installPopup();
    this.showModal = false;
    //this.router.navigate(['/login']);
    // Perform any action when the user clicks "OK"
    // For example, you might want to redirect the user to the signup page
  }

  installPopup() {
    if (
      navigator.platform === 'iPhone' ||
      navigator.platform === 'iPad' ||
      navigator.platform === 'iPod'
    ) {
      Swal.fire({
        title:
          'Tap "Share" button on the bottom of your screen and select "Add to Home Screen"',
        text: '',
        icon: 'info',

        confirmButtonText: 'Okay',
        confirmButtonColor: 'rgb(38 117 79)',
      });
    } else {
      // this.pwaService.installPWA();
      window.location.href =
        'https://play.google.com/store/apps/details?id=app.near2me.twa';
    }
  }
}
