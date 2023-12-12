import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

///Routes

import { CategoriesComponent } from './categories/categories.component';
import { SelectLocationComponent } from './select-location/select-location.component';
import { DescriptionComponent } from './description/description.component';
import { ShowAllProductsComponent } from './show-all-products/show-all-products.component';
import { ShowAllQuickLinksComponent } from './show-all-quick-links/show-all-quick-links.component';
import { PostItemComponent } from './post-item/post-item.component';
import { ProfileComponent } from './profile/profile.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { SettingsComponent } from './settings/settings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SellerDetailsComponent } from './seller-details/seller-details.component';
import { ShowAllServicesComponent } from './show-all-services/show-all-services.component';
import { ListingComponent } from './listing/listing.component';
import { SelectLanguageComponent } from './select-language/select-language.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { VerifyPhoneNumberComponent } from './verify-phone-number/verify-phone-number.component';
import { EnterYourNameComponent } from './enter-your-name/enter-your-name.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { FaqComponent } from './faq/faq.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { EnterUserCategoryComponent } from './enter-user-category/enter-user-category.component';
import { ShowMoreRecentProductComponent } from './show-more-recent-product/show-more-recent-product.component';
const routes: Routes = [
  //Configuring routing names
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verify-phone-number', component: VerifyPhoneNumberComponent },
  { path: 'enter-your-name', component: EnterYourNameComponent },
  { path: 'select-location', component: SelectLocationComponent },
  { path: 'select-language', component: SelectLanguageComponent },
  { path: 'show-all-products', component: ShowAllProductsComponent },
  { path: 'show-all-quick-links', component: ShowAllQuickLinksComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'description', component: DescriptionComponent },
  { path: 'post-item', component: PostItemComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'edit-details', component: EditDetailsComponent },
  { path: 'favourites', component: FavouritesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'seller-details', component: SellerDetailsComponent },
  { path: 'listing', component: ListingComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  {path: 'enter-user-category', component: EnterUserCategoryComponent},
  {path: 'show-more-recent-product', component: ShowMoreRecentProductComponent},
  //Configuring routing names
  { path: 'show-all-service', component: ShowAllServicesComponent },
  //Setting the default page to go to if there is no path.
  { path: 'introduction', component: IntroductionComponent },
  // Add your other routes here
  
  { path: '', redirectTo: 'introduction', pathMatch: 'full' }, // Redirect to introduction on root path
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
