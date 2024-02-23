import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VerifyPhoneNumberComponent } from './verify-phone-number/verify-phone-number.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { EnterYourNameComponent } from './enter-your-name/enter-your-name.component';
import { CategoriesComponent } from './categories/categories.component';
import { SelectLocationComponent } from './select-location/select-location.component';
import { DescriptionComponent } from './description/description.component';
import { ShowAllProductsComponent } from './show-all-products/show-all-products.component';
import { ShowAllQuickLinksComponent } from './show-all-quick-links/show-all-quick-links.component';
import { PostItemComponent } from './post-item/post-item.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SelectedLocationComponent } from './selected-location/selected-location.component';
import { ProfileComponent } from './profile/profile.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { SettingsComponent } from './settings/settings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SellerDetailsComponent } from './seller-details/seller-details.component';
//other imports
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ShowAllServicesComponent } from './show-all-services/show-all-services.component';
import { ListingComponent } from './listing/listing.component';
import { DatePipe } from '@angular/common';
import { FormatTimePipe } from './verify-phone-number/format-time.pipe';
import { AuthInterceptor } from './login/auth.interceptor';
// to import the local storage
import { LocalStorageService } from 'angular-web-storage';
//google map import
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

//To import translate modules
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SelectLanguageComponent } from './select-language/select-language.component';
import { LanguagePopupComponent } from './language-popup/language-popup.component';

//notifications
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
initializeApp(environment.firebase);

import { LoginPopupComponent } from './login-popup/login-popup.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { FaqComponent } from './faq/faq.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { InstallPopupComponent } from './install-popup/install-popup.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { IntroductionComponent } from './introduction/introduction.component';
initializeApp(environment.firebase);

//import Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { EnterUserCategoryComponent } from './enter-user-category/enter-user-category.component';

import { ShowMoreRecentProductComponent } from './show-more-recent-product/show-more-recent-product.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VerifyPhoneNumberComponent,
    FormatTimePipe,
    HomeComponent,
    NavigationBarComponent,
    EnterYourNameComponent,
    CategoriesComponent,
    SelectLocationComponent,
    DescriptionComponent,
    ShowAllProductsComponent,
    ShowAllQuickLinksComponent,
    PostItemComponent,
    SelectedLocationComponent,
    ProfileComponent,
    EditDetailsComponent,
    FavouritesComponent,
    SettingsComponent,
    NotificationsComponent,
    SellerDetailsComponent,
    ShowAllServicesComponent,
    ListingComponent,
    SelectLanguageComponent,
    LanguagePopupComponent,
    LoginPopupComponent,
    ContactUsComponent,
    AboutUsComponent,
    FaqComponent,
    InstallPopupComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    IntroductionComponent,
    EnterUserCategoryComponent,

    ShowMoreRecentProductComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // GooglePlaceModule, // Google Place
    MatCheckboxModule, //Used for Checkbox for Login Page Component
    AppRoutingModule,
    MatButtonModule,
    MatTabsModule,
    //other imports
    FormsModule,
    HttpClientModule,
    NgxDropzoneModule, //Used for Upload-Image Component
    MatDialogModule, //Used to import Angular Material
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) =>
          new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    DatePipe,
    LocalStorageService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
