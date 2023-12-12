import { Component } from '@angular/core';
import { TranslationService } from '../translation.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-language-popup',
  templateUrl: './language-popup.component.html',
  styleUrls: ['./language-popup.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})
export class LanguagePopupComponent {
  constructor(private translationService: TranslationService) {}
  storedLanguage: string;
  selectedLanguage: string;
  showLangPopup: boolean = true;

  ngOnInit(): void {
    this.storedLanguage = localStorage.getItem('setLanguage');
    if (this.storedLanguage) {
      this.showLangPopup = false;
      this.selectedLanguage = this.storedLanguage;
      // Set the default selection based on storedLanguage value
      const radioButtons = document.getElementsByName('radio');
      for (let i = 0; i < radioButtons.length; i++) {
        const radioButton = radioButtons[i] as HTMLInputElement;
        if (radioButton.value === this.storedLanguage) {
          radioButton.checked = true;
          break;
        }
      }
    }
  }

  switchLanguage(): void {
    if (this.selectedLanguage) {
      localStorage.setItem('setLanguage', this.selectedLanguage);
      this.translationService.switchLanguage(this.selectedLanguage);
    } else {
      localStorage.setItem('setLanguage', 'en');
    }
    this.showLangPopup = false;
  }
}
