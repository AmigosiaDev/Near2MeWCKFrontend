import { Component, OnInit } from '@angular/core';
import { TranslationService } from './translation.service';
//To prompt user to update Service Worker cache on each update
import { SwUpdate } from '@angular/service-worker';
import { PwaService } from './pwa.service'; // Import the PwaService
//For the introduction page
import { MatDialog } from '@angular/material/dialog';
import { IntroductionComponent } from './introduction/introduction.component';
//SweetAlert2
import Swal from 'sweetalert2';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})

// <div [@fadeInOut]>

// </div>
export class AppComponent implements OnInit {
  constructor(
    private translationService: TranslationService,
    private pwaService: PwaService,
    private swUpdate: SwUpdate,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const storedLanguage = localStorage.getItem('setLanguage');
    if (storedLanguage) {
      this.translationService.switchLanguage(storedLanguage);
    } else {
      // Default language if 'setLanguage' is not set
      this.translationService.switchLanguage('en');
    }

    //To prompt user to update Service Worker cache on each update
    // if (this.swUpdate.isEnabled) {
    //   this.swUpdate
    //     .activateUpdate()
    //     .then(() => {
    //       Swal.fire({
    //         title: 'There is a newer version of Near2Me! 😀',
    //         icon: 'success',
    //         confirmButtonText: 'Continue to update!',
    //         confirmButtonColor: 'rgb(38 117 79)',
    //       }).then((result) => {
    //         if (result.isConfirmed) {
    //           window.location.reload();
    //         }
    //       });
    //     })
    //     .catch((error) => {
    //       console.error('Error activating update:', error);
    //     });
    // }

    // this.checkShowIntroduction();
  }

  checkShowIntroduction() {
    const showIntroduction =
      localStorage.getItem('showIntroduction') !== 'false';

    if (showIntroduction) {
      const dialogRef = this.dialog.open(IntroductionComponent, {
        disableClose: true,
        width: '400px',
      });

      dialogRef.afterClosed().subscribe(() => {
        // Do something after the introduction modal is closed.
      });
    }
  }

  title = 'Near2Me';
}
