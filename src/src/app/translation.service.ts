import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private http: HttpClient, private translate: TranslateService) {
    this.translate.setDefaultLang('en'); // Set the default language
    // Load translations from the JSON files
    this.translate.use('en'); // Set the initial language
    // Optional: Add language files for additional languages
    // this.loadTranslation('fr').subscribe((translations) => {
    //   this.translate.setTranslation('fr', translations);
    // });

  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
  // private loadTranslation(language: string): Observable<any> {
  //   const translationFile = `../assets/i18n/${language}.json`;
  //   return this.http.get(translationFile);
  // }
}
