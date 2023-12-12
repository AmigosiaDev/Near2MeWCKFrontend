import { Component, OnInit } from '@angular/core';

//Other imports
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';
//To import the environment files
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl;
//SweetAlert2
import Swal from 'sweetalert2';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

interface UserProfile {
  userName: string;
  whatsApp: string;
  address: string;
  profileID: string;
  areaOfInterest: string;
  category: string;
  about: string;
}

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})
export class EditDetailsComponent implements OnInit {
  //Declare an empty array and default values of input to null.
  newUserArray: any[] = [];
  currentNewUserDatabaseID = '';

  userId: string = '';
  imageId: string = '';
  //to disable the whatsapp
  disableWhatsApp: boolean;

  userForEdit: any;
  dataBaId: string;
  userArray: any;
  hasChanges: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    // this.route.queryParams.subscribe((params) => {
    //   this.dataBaId = params['passedDbId'];
    // });
    console.log(this.dataBaId);
    this.fetchUser();
  }

  detectChanges() {
    // Implement your logic to detect changes in the user details
    // For example, compare the current values with the original values fetched during fetchUser().
    // For demonstration purposes, let's assume the "userName", "whatsApp", and "address" fields are the ones being edited.
    if (
      this.userName !== this.userArray.userName ||
      this.whatsApp !== this.userArray.whatsApp ||
      this.address !== this.userArray.address
    ) {
      this.hasChanges = true;
    } else {
      this.hasChanges = false;
    }
  }

  onInputChange() {
    this.detectChanges();
  }

  /********************************************* */

  /**profile image upload */
  defaultProfileImage = 'assets/personImages/defaultimage.jpg';
  selectedImageUrls: (string | ArrayBuffer)[] = [];
  images: File[] = [];

  generateID: string;

  onImageSelected(event, index) {
    console.log(event);
    const file = event.target.files[0];
    this.compressImage(file)
      .then((compressedFile) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedImageUrls[index] = reader.result;
        };
        reader.readAsDataURL(compressedFile as Blob);

        const compressedFileName = file.name;
        const compressedImageFile = new File(
          [compressedFile as Blob],
          compressedFileName
        );
        this.images[index] = compressedImageFile;
      })
      .catch((error) => {
        console.error('Image compression error:', error);
      });
    console.log(this.images, 'line9437593475');
    this.detectChanges();
  }
  compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const size = Math.min(image.width, image.height);
          const xOffset = (image.width - size) / 2;
          const yOffset = (image.height - size) / 2;
          const maxWidth = 800;
          const maxHeight = 800;
          let width = size;
          let height = size;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(
            image,
            xOffset,
            yOffset,
            size,
            size,
            0,
            0,
            width,
            height
          );

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], 'compressed_image.jpg');
              if (compressedFile.size > 300 * 1024) {
                const quality = (300 * 1024) / compressedFile.size;
                canvas.toBlob(
                  (furtherBlob) => {
                    const furtherCompressedFile = new File(
                      [furtherBlob],
                      'further_compressed_image.jpg'
                    );
                    resolve(furtherCompressedFile);
                  },
                  'image/jpeg',
                  quality
                );
              } else {
                resolve(compressedFile);
              }
            },
            'image/jpeg',
            0.9
          );
        };
        if (typeof event.target.result === 'string') {
          image.src = event.target.result;
        }
      };
      reader.onerror = (error) => {
        console.error('File reading error:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  save() {
    const profileData: UserProfile = {
      userName: this.userName,
      whatsApp: this.whatsApp,
      address: this.address,
      profileID: this.profileID,
      areaOfInterest: this.areaOfInterest,
      category: this.category,
      about: this.about,
    };

    const formData = new FormData();

    // Check if images are present and append them to the formData
    if (this.images && this.images.length > 0) {
      formData.append('images', this.images[0]);
    }
    console.log('userimage before data on SAVE:', this.userImageData);
    if (this.userImageData && this.userImageData.length > 0) {
      for (let i = 0; i < this.userImageData.length; i++) {
        formData.append('userImageData', this.userImageData[i]);
        console.log(
          'userimagedata :::::::::::::::::::::::',
          this.userImageData
        );
      }
    }

    // Append other profile data to formData
    for (const key in profileData) {
      if (profileData.hasOwnProperty(key)) {
        formData.append(key, profileData[key]);
      }
    }

    // Send the PUT request with the user profile data and images
    this.http.put(BACKEND_URL + `/updateProfile`, formData).subscribe(
      (response) => {
        localStorage.setItem('userCategory', this.category);
        Swal.fire({
          title: 'Success',
          text: 'Your Profile has been Successfully updated! 😀 ',
          icon: 'success',

          confirmButtonText: 'Okay',
          confirmButtonColor: 'rgb(38 117 79)',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/profile']);

            // For more information about handling dismissals please visit
            // https://sweetalert2.github.io/#handling-dismissals
          }
        });
      },
      (error) => {
        Swal.fire({
          title: 'Profile update failed 🙄',

          icon: 'error',

          confirmButtonText: 'Okay',
          confirmButtonColor: 'rgb(38 117 79)',
        }).then((result) => {
          if (result.isConfirmed) {
            // For more information about handling dismissals please visit
            // https://sweetalert2.github.io/#handling-dismissals
          }
        });
      }
    );
  }

  /******************************************************************** */

  /*selected image upload 1*/
  defaultImages = 'assets/personImages/defaultimage.jpg';

  //Whatsapp Checkbox
  myModel = true;

  //Image Upload Section
  files: File[] = [];
  onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }
  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  //-----------------------for the edit the profile--------------------
  userName: string = '';
  profileID: string = '';
  mobileNumber: string = '';
  whatsApp: string = '';
  areaOfInterest: string = '8';
  address: string = '';
  category: string;
  about: string = '';
  formattedWhatsApp: string = '';
  userImage1: string = '';
  userImage2: string = '';
  userImage3: string = '';
  toggleWhatsApp() {
    if (this.myModel) {
      this.whatsApp = this.mobileNumber;
    } else {
      this.whatsApp = '';
    }
  }

  getAreaOfInterest(area) {
    console.log('the area is :', area);
    this.areaOfInterest = area;
    this.detectChanges();
  }
  imageURL: string = null;
  fetchUser(): void {
    this.http.get(`${BACKEND_URL}/getuser`).subscribe(
      (response) => {
        console.log(response);
        this.userArray = response;
        console.log(this.userArray);
        this.profileID = this.userArray.profileID;
        this.userName = this.userArray.username;
        this.mobileNumber = this.userArray.mobile;
        this.imageURL = this.userArray.imageURL;
        if (this.userArray.whatsApp !== 'undefined') {
          this.whatsApp = this.userArray.whatsApp;
          if (this.whatsApp == this.mobileNumber) {
            this.disableWhatsApp = true;
          }
        }

        for (let i = 0; i < this.userArray.userImageData.length; i++) {
          console.log(this.userArray);
          if (this.userArray.userImageData[i]) {
            this.userImageData[i] = this.userArray.userImageData[i];
            console.log('USER IMAGE DATA :', this.userImageData[i]);
          }
        }
        this.userImage1 = this.userArray.userImageURL[0];
        this.userImage2 = this.userArray.userImageURL[1];
        this.userImage3 = this.userArray.userImageURL[2];

        this.areaOfInterest = this.userArray.areaOfInterest;
        if (this.userArray.address !== 'undefined') {
          this.address = this.userArray.address;
        }
        this.category = this.userArray.category;
        if (this.userArray.about !== 'undefined') {
          this.about = this.userArray.about;
        }

        this.imageURL = this.userArray.profileImageURL;
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }

  /**image upload */
  selectedImageUrl: (string | ArrayBuffer)[] = [];
  userImageData: File[] = [];
  productThumbNailImage: File | undefined;
  editProductDBID: any = undefined;

  uploadButton1Enabled: boolean = true;
  uploadButton2Enabled: boolean = false;
  uploadButton3Enabled: boolean = false;

  userImages(event, index) {
    console.log(event);
    const file = event.target.files[0];
    this.userImageCompress(file, index)
      .then((compressedFile) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedImageUrl[index] = reader.result;
        };
        reader.readAsDataURL(compressedFile as Blob);

        const compressedFileName = this.getCompressedImageName(index);
        const compressedImageFile = new File(
          [compressedFile as Blob],
          compressedFileName
        );
        this.userImageData[index] = compressedImageFile;
        console.log('after compression', this.userImageData);
        console.log(
          'compressed image and position',
          this.userImageData[index],
          index
        );
      })
      .catch((error) => {
        console.error('Image compression error:', error);
      });
    if (index === 0) {
      this.uploadButton1Enabled = true;
      this.uploadButton2Enabled = !this.editProductDBID;
    } else if (index === 1) {
      this.uploadButton2Enabled = true;
      this.uploadButton3Enabled = !this.editProductDBID;
    } else if (index === 2) {
      this.uploadButton3Enabled = true;
      // Enable the upload button for the previous index (index - 1)
      this.uploadButton2Enabled = true;
    }
    console.log('selected index:;;;;;; ', this.userImageData);
  }

  getCompressedImageName(index) {
    const profileid = this.profileID; // Replace with the actual profile ID variable
    return `${profileid}_image${index + 1}`;
  }

  userImageCompress(file, index) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const size = Math.min(image.width, image.height);
          const xOffset = (image.width - size) / 2;
          const yOffset = (image.height - size) / 2;
          const maxWidth = 800;
          const maxHeight = 800;
          let width = size;
          let height = size;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(
            image,
            xOffset,
            yOffset,
            size,
            size,
            0,
            0,
            width,
            height
          );

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], 'compressed_image.jpg');
              if (compressedFile.size > 300 * 1024) {
                const quality = (300 * 1024) / compressedFile.size;
                canvas.toBlob(
                  (furtherBlob) => {
                    const furtherCompressedFile = new File(
                      [furtherBlob],
                      'further_compressed_image.jpg'
                    );
                    resolve(furtherCompressedFile);
                  },
                  'image/jpeg',
                  quality
                );
              } else {
                resolve(compressedFile);
              }
            },
            'image/jpeg',
            0.9
          );
        };
        if (typeof event.target.result === 'string') {
          image.src = event.target.result;
        }
      };
      reader.onerror = (error) => {
        console.error('File reading error:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }
}
