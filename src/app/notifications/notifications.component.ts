import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

//Other imports
import { AuthUserService } from '../auth-user.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
const BACKEND_URL = environment.apiUrl;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})
export class NotificationsComponent implements OnInit {
  constructor(
    private router: Router,
    private AuthUserService: AuthUserService,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}
  notifications: any[];
  // sellerId: string='';
  // message:any;
  // browserToken: string='';
  selectedNotifications: any[] = [];
  timer: any;
  isTapHoldActive = false;

  // storedProfileID:any = this.localstorage.get("profileID");
  // isLoggedIn = this.localstorage.get('isLoggedIn');
  // sellerPhone = this.localstorage.get('passedPhoneNumber');
  ngOnInit(): void {
    //To Check Authentication
    this.AuthUserService.authUser();
    const storedProfileID = localStorage.getItem('profileID');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    console.log(storedProfileID);
    if (isLoggedIn && storedProfileID) {
      this.notificationService
        .getNotificationsByProfileID(storedProfileID)
        .subscribe(
          (response) => {
            console.log(response);
            this.notifications = response.notifications;
            // Sort notifications by date in descending order
            this.notifications.sort((a, b) => {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              return dateB - dateA;
            });
          },
          (error) => {
            console.error('Error fetching notifications:', error);
          }
        );
    }
  }
  redirectToSellerDetails(customerID: string) {
    // Redirect to the seller details page and pass the profileId as a parameter in the URL
    this.router.navigate(['/seller-details'], {
      queryParams: { profileID: customerID, messageToConsumer: true },
    });
  }
  //Select and delete notificationS

  isSelected(notification: any): boolean {
    return this.selectedNotifications.includes(notification);
  }

  selectNotification(notification: any): void {
    if (this.isSelected(notification)) {
      this.selectedNotifications = this.selectedNotifications.filter(
        (n) => n !== notification
      );
    } else {
      this.selectedNotifications.push(notification);
    }
  }

  deleteSelectedNotifications(): void {
    const notificationIds = this.selectedNotifications.map(
      (notification) => notification._id
    );
    const confirmation = window.confirm(
      'Are you sure you want to delete the selected notifications?'
    );
    if (!confirmation) {
      return; // User canceled the deletion
    }
    // Send a DELETE request to your backend API
    this.http
      .delete(`${BACKEND_URL}/notifications/delete-selected`, {
        body: { notificationIds },
      })
      .subscribe(
        (response) => {
          console.log('Notifications deleted:', response);

          // Perform any necessary UI updates
          // Example: Remove deleted notifications from the list
          this.notifications = this.notifications.filter(
            (notification) => !notificationIds.includes(notification._id)
          );

          // Clear the selected notifications array
          this.selectedNotifications = [];
        },
        (error) => {
          console.error('Failed to delete notifications:', error);
        }
      );
  }
}
