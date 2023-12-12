import { Injectable } from '@angular/core';

declare global {
  interface BeforeInstallPromptEvent extends Event {
    userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
    }>;
    readonly platforms: string[];
    prompt(): Promise<void>;
  }
}

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  deferredPrompt: BeforeInstallPromptEvent;

  constructor() {
    //Event listener to handle PWA installation prompt
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      // Prevent the default prompt from appearing
      event.preventDefault();
      // Store the deferred prompt event
      this.deferredPrompt = event as BeforeInstallPromptEvent;
    });
  }

  installPWA() {
    if (this.deferredPrompt) {
      // Show the PWA installation prompt
      this.deferredPrompt
        .prompt()
        .then(() => {
          // Wait for the user to respond to the prompt
          this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the PWA installation');
            } else {
              console.log('User dismissed the PWA installation');
            }
          });
        })
        .catch((error) => {
          console.log(
            'Error occurred while prompting for PWA installation:',
            error
          );
        });
    }
  }
}
