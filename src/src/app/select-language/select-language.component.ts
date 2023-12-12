import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/translation.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.css']
})
export class SelectLanguageComponent implements OnInit {
  constructor(private translationService: TranslationService, private router:Router) { }
  storedLanguage: string;
  selectedLanguage: string;


  ngOnInit(): void {
    this.storedLanguage = localStorage.getItem('setLanguage');
    if (this.storedLanguage) {
      this.selectedLanguage = this.storedLanguage
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
    }
    this.router.navigate(['/settings'])
  }
}
