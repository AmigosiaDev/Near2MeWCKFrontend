import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
//Other imports
import { AuthUserService } from '../auth-user.service';
import { ActivatedRoute } from '@angular/router'; // for passing category id value
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common'; //Used for Back Button
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
//To import the environment files
import { environment } from '../../environments/environment';
//SweetAlert2
import Swal from 'sweetalert2';

const BACKEND_URL = environment.apiUrl;
interface productInterface {
  _id: {
    type: String;
    required: true;
  };
  productCategory: {
    type: String;
    required: true;
  };
  productID: {
    type: String;
    required: true;
  };
  productTitle: {
    type: String;
    required: true;
  };
  productPrice: {
    type: String;
    required: true;
  };
  productUnit: {
    type: String;
    required: true;
  };
  productDescription: {
    type: String;
    required: true;
  };
  address: {
    type: String;
  };
  productTypeOfSale: {
    type: String;
    required: true;
  };
  productStatus: {
    type: String;
    required: true;
  };
  isApproved: {
    type: Boolean;
    required: true;
    default: false;
  };
  productValidity: {
    type: number;
    required: true;
  };
  productImageData: {
    type: String;
    required: true;
  };
  location: {
    type: {
      type: String;
      enum: ['Point'];
      required: true;
    };
    coordinates: {
      type: [Number];
      required: true;
    };
  };
}

interface serviceInterface {
  _id: {
    type: String;
    required: true;
  };
  date: {
    type: Date;
    required: true;
  };

  serviceCategory: {
    type: String;
    required: true;
  };
  serviceID: {
    type: String;
    required: true;
  };

  serviceTitle: {
    type: String;
    required: true;
  };
  serviceDescription: {
    type: String;
    required: true;
  };
  address: {
    type: String;
  };
  serviceStatus: {
    type: String;
    required: true;
  };
  isApproved: {
    type: Boolean;
    required: true;
    default: false;
  };
  serviceValidity: {
    type: Number;
    required: true;
  };

  serviceImageData: {
    type: [String];
  };
  location: {
    type: {
      type: String;
      enum: ['Point'];
      required: true;
    };
    coordinates: {
      type: [Number];
      required: true;
    };
  };
}
@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css'],
})
export class PostItemComponent implements OnInit {
  products: productInterface[] = [];
  showPostItem: boolean = true;
  showSelectCategory: boolean = false;

  //Declare a constructor to read data from database by calling getAllStudents()
  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private localStorage: LocalStorageService,
    private location: Location,
    private elementRef: ElementRef,
    private AuthUserService: AuthUserService,

  ) {
    console.log('Product Category is : ', this.productCategory);
  }
  getFontClass(): string {
    const currentLanguage = localStorage.getItem('setLanguage');

    switch (currentLanguage) {
      case 'en':
        return 'en-font';
      case 'ml':
        return 'ml-font';
      case 'tl':
        return 'tl-font';
      // Handle other languages...
      default:
        return 'en-font'; // Default font size class
    }
  }
  previousScreen() {
    if (this.showSelectCategory === true) {
      this.showSelectCategory = false;
      this.showPostItem = true;
    } else if (this.profilePage) {
      this.router.navigate(['/profile']);
    } else {
      this.goBack();
    }
  }

  goBack(): void {
    //this.location.back();
    this.router.navigate(['/home']);
  }

  /*to scroll to the top*/
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  latitude: any = undefined;
  longitude: any = undefined;
  locationData: any = undefined;
  userCategory: string = undefined;
  profileID: string = undefined;
  profilePage: boolean;
  isButtonClicked = false;
  //To go to select location page
  goToSelectLocation() {
    this.router.navigate(['/select-location'], {
      queryParams: { returnPage: 'post-item' },
    });
  }

  ngOnInit() {
    //To Check Authentication
    this.AuthUserService.authUser();
    //this.checkLocationAvailable();
    //To call the function that gets the selected location from location service
    this.locationData = this.localStorage.get('locationData');
    console.log('POST PAGE LOCATION DATA', this.locationData);
    this.latitude = this.locationData.latitude;
    this.longitude = this.locationData.longitude;
    this.address = this.locationData.address;

    console.log('Addresses in NGONINT', this.address);

    //To retrieve the Selected Category
    this.route.queryParams.subscribe((params) => {
      this.selectedCategoryValue = params['SelectedCategoryValue'];
      this.passedproductCategoryName = params['selectedCategoryName'];
      this.profilePage = params['profilePage'];
      if (this.passedproductCategoryName !== undefined) {
        this.productCategoryName = this.passedproductCategoryName;
      }
      this.productCategory = this.selectedCategoryValue;
      console.log('Product Category ID is: ', this.productCategory);
      console.log('Product Category Name is: ', this.productCategoryName);
    });
    //To retreive ID for Editing Product
    this.route.queryParams.subscribe((params) => {
      this.editProductDBID = params['passedProductDBID'];
      console.log('Edit Product DB ID is : ', this.editProductDBID);
    });

    this.productID = 'PR' + new Date().getTime().toString().substr(3, 10);
    console.log('Product ID is ::::::::::::::::::::::::::::: ', this.productID);

    this.serviceID = 'SR' + new Date().getTime().toString().substr(3, 10);
    console.log('Service ID is ::::::::::::::::::::: ', this.serviceID);

    if (this.editProductDBID !== undefined) {
      this.fetchProduct(this.editProductDBID);
    }

    //To retreive ID for Editing Service
    this.route.queryParams.subscribe((params) => {
      this.editServiceDBID = params['passedServiceDBID'];
      console.log('Edit Service DB ID is : ', this.editServiceDBID);
    });

    if (this.editServiceDBID !== undefined) {
      this.fetchService(this.editServiceDBID);
    }
    this.scrollToTop();

    this.userCategory = localStorage.getItem('userCategory');
    this.profileID = localStorage.getItem('profileID');
    console.log('Profile ID is : ', this.profileID);
  }

  //To limit the maximum digits of price
  limitDigits(event: any) {
    const value = event.target.value;
    const maxDigits = 7;
    const sanitizedValue = value.replace(/[^0-9]/g, ''); // Remove non-digit characters
    if (sanitizedValue.length > maxDigits) {
      event.target.value = sanitizedValue.slice(0, maxDigits);
    } else {
      event.target.value = sanitizedValue;
    }
    this.productPrice = event.target.value; // Update the bound property with the sanitized value
  }

  //----------------------------------------------------------------ADDING PRODUCTS----------------------------------------------------------------
  //Declare an empty array and default values of input to null.
  productArray: any[] = [];
  currentProductDatabaseID = '';

  //For schema
  productCategory: string = null;
  productID: string = '';
  productTitle: string = '';
  productPrice: string = '';
  productUnit: string = 'Nos';
  productDescription: string = '';
  address: string;
  productTypeOfSale: string = 'NOR';
  productStatus: string = 'Active';
  productValidity: number = 14;
  date: string = '';
  isApproved: boolean = false;
  productImageURL: [] = [];
  productImage1: string;
  productImage2: string;
  productImage3: string;

  serviceImage1: string;
  serviceImage2: string;
  serviceImage3: string;
  //Declare a variable and retrieve the query parameter value on component initialization for category
  selectedCategoryValue: string = '';
  productCategoryName: string = 'Select product category';
  passedproductCategoryName: string = '';

  //-------------------------------------PRODUCTS Image Upload Button------------------------------------
  defaultImages = 'assets/personImages/defaultimage.jpg';

  selectedImageUrls: (string | ArrayBuffer)[] = [];
  productImageData: File[] = [];
  productThumbNailImage: File | undefined;

  uploadButton1Enabled: boolean = true;
  uploadButton2Enabled: boolean = false;
  uploadButton3Enabled: boolean = false;

  onImageSelected(event, index) {
    console.log(event);
    const file = event.target.files[0];
    this.compressImage(file, index)
      .then((compressedFile) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedImageUrls[index] = reader.result;
        };
        reader.readAsDataURL(compressedFile as Blob);

        const compressedFileName = this.getCompressedImageName(index);
        const compressedImageFile = new File(
          [compressedFile as Blob],
          compressedFileName
        );
        this.productImageData[index] = compressedImageFile;

        if (index === 0) {
          this.compressFurtherImage(compressedImageFile)
            .then((furtherCompressedFile) => {
              this.productThumbNailImage = furtherCompressedFile;
            })
            .catch((error) => {
              console.error('Listing image compression error:', error);
            });
        }
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
  }

  getCompressedImageName(index) {
    const productID = this.productID; // Replace with the actual profile ID variable
    return `${productID}_image${index + 1}`;
  }
  compressImage(file, index) {
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

  compressFurtherImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          let width = image.width;
          let height = image.height;

          if (file.size > 300 * 1024) {
            const maxSize = 150;
            if (width > height) {
              height *= maxSize / width;
              width = maxSize;
            } else {
              width *= maxSize / height;
              height = maxSize;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, width, height);

            canvas.toBlob(
              (blob: Blob) => {
                const furtherCompressedFile = new File(
                  [blob],
                  this.productID + '_thumbnailImage.jpg'
                );
                resolve(furtherCompressedFile);
              },
              'image/jpeg',
              1
            );
          } else {
            // If the image size is smaller or equal to 300 KB, perform only square cropping
            const size = Math.min(width, height);
            const xOffset = (width - size) / 2;
            const yOffset = (height - size) / 2;
            const squareSize = 150;

            canvas.width = squareSize;
            canvas.height = squareSize;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(
              image,
              xOffset,
              yOffset,
              size,
              size,
              0,
              0,
              squareSize,
              squareSize
            );

            canvas.toBlob(
              (blob: Blob) => {
                const croppedFile = new File(
                  [blob],
                  this.productID + '_thumbnailImage.jpg'
                );
                resolve(croppedFile);
              },
              'image/jpeg',
              1
            );
          }
        };
        image.src = event.target.result;
      };
      reader.onerror = (error) => {
        console.error('Listing image file reading error:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  //-------------------------------------*****************------------------------------------

  //-------------------------------------*****************------------------------------------

  //-------------------------------------PRODUCTS Save Button------------------------------------
  //Function to Create/Save data to the Database using the register() which works if currentStudentID is null; else it will do UpdateRecords().
  //This Function is called onclick of Save button.

  //Select Validity

  getDays(days) {
    console.log('The days is: ', days);
    this.productValidity = days;
  }

  //TO go to profile-page after register/update
  goToProfile() {
    this.router.navigate(['/profile'], {
      queryParams: {
        refreshProfilePage: true,
      },
    });
  }

  // On clickin
  save() {
    if (this.currentProductDatabaseID == '') {
      if (
        this.productCategory != undefined &&
        this.productTitle != '' &&
        this.productPrice != ''
      ) {
        this.register(
          this.productCategory,
          this.productID,
          this.productTitle,
          this.productPrice,
          this.productUnit,
          this.productDescription,
          this.userCategory,
          this.profileID,
          this.address,
          this.productTypeOfSale,
          this.productStatus,
          this.productValidity.toString(),
          (this.date = new Date().toISOString().substr(0, 10).toString()),
          this.productImageData,
          this.productThumbNailImage
        ).subscribe(
          () =>
            Swal.fire({
              title: 'Successfully posted! 😀',
              text: ' Your post will go live after approval.',
              icon: 'success',
              confirmButtonColor: 'rgb(38 117 79)',
              confirmButtonText: 'Okay',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/profile']);
                location.reload();
                // For more information about handling dismissals please visit
                // https://sweetalert2.github.io/#handling-dismissals
              }
            }),

          (error: HttpErrorResponse) => {
            // Handle error, e.g., show an error message, log the error, etc.
            console.log(error);
            if (error.status === 403) {
              Swal.fire({
                title: 'Alert',
                text: ' Your posting limit has been reached',
                icon: 'warning',

                confirmButtonText: 'Okay',
                confirmButtonColor: 'rgb(38 117 79)',
              }).then((result) => {
                if (result.isConfirmed) {
                  // For more information about handling dismissals please visit
                  // https://sweetalert2.github.io/#handling-dismissals
                }
              });
            } else {
              Swal.fire({
                title: 'Alert',
                text: ' Posting failed! 🙄',
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
          }
        );
        this.goToProfile();
      } else {
        Swal.fire({
          title: 'Please enter all required fields 🥸',
          text: '(Category, Item title, Price)',
          icon: 'warning',

          confirmButtonText: 'Okay',
          confirmButtonColor: 'rgb(38 117 79)',
        }).then((result) => {
          if (result.isConfirmed) {
            // For more information about handling dismissals please visit
            // https://sweetalert2.github.io/#handling-dismissals
          }
        });
      }
    } else {
      this.updateProductRecord(
        this.productCategory,
        this.productID,
        this.productTitle,
        this.productPrice,
        this.productUnit,
        this.productDescription,
        this.address,
        this.productTypeOfSale,
        (this.productStatus = 'Active'),
        this.productValidity.toString(),
        (this.date = new Date().toISOString().substr(0, 10).toString()),
        this.isApproved,
        this.profileID,
        this.productImageData,
        this.productThumbNailImage
      );

      this.goToProfile();
    }
  }

  //--------------------To register a new Product---------------------------------------
  register(
    productCategory: string,
    productID: string,
    productTitle: string,
    productPrice: string,
    productUnit: string,
    productDescription: string,
    userCategory: string,
    profileID: string,
    address: string,
    productTypeOfSale: string,
    productStatus: string,
    productValidity: string,
    date: string,
    productImageData: File[],
    productThumbNailImage: File | null
  ) {
    let formData = new FormData();
    //Append to formData
    console.log('productPrice', productPrice);
    formData.append('productCategory', productCategory);
    formData.append('productID', productID);
    formData.append('productTitle', productTitle);
    formData.append('productPrice', productPrice);
    formData.append('productUnit', productUnit);
    formData.append('productDescription', productDescription);
    formData.append('userCategory', userCategory);
    formData.append('profileID', profileID);
    formData.append('address', address);
    formData.append('productTypeOfSale', productTypeOfSale);
    formData.append('productStatus', productStatus);
    formData.append('productValidity', productValidity);
    formData.append('latitude', this.latitude.toString());
    formData.append('longitude', this.longitude.toString());

    formData.append('date', date);
    // Append each selected file to the FormData object
    for (let i = 0; i < this.productImageData.length; i++) {
      formData.append('images', this.productImageData[i]);
    }
    // Append listingImage to formData
    if (productThumbNailImage) {
      formData.append('images', productThumbNailImage);
    }

    //Console log
    console.log('upload image file: ', productImageData);
    console.log(' The form data is:-----', formData);

    return this.http.post(BACKEND_URL + '/addProduct', formData, {
      responseType: 'text',
    });
  }
  //------------------------------------------------ To Edit POST---------------------------------------------------------------
  editProductDBID: any = undefined;
  editImagesArray: any[] = [];
  productForEdit: any;
  checkProductImage: string = '';
  fetchProduct(ID: string) {
    this.http.get(BACKEND_URL + `/getProductforEdit/${ID}`).subscribe(
      (productForEdit: any) => {
        this.productForEdit = productForEdit.products;
        console.log('product For Edit: ', this.productForEdit);

        //To show the values on Input fields
        this.currentProductDatabaseID = this.productForEdit._id;
        this.productCategory = this.productForEdit.productCategory;
        console.log('the productccccccccccccccc', this.productCategory);
        this.selectCategoryForEdit();
        // switch (this.productCategory) {
        //   case 'ID_CNB':
        //     this.productCategoryName = 'Home Produce/Cakes and Bakes';
        //     break;
        //   // Add more cases for other category values if needed
        //   default:
        //     this.productCategoryName = 'Unknown Category';
        //     break;
        // }
        // this.productCategoryName = this.productCategory;
        this.productID = this.productForEdit.productID;
        this.productTitle = this.productForEdit.productTitle;
        this.productPrice = this.productForEdit.productPrice;
        this.productUnit = this.productForEdit.productUnit;
        this.productDescription = this.productForEdit.productDescription;
        //this.address = this.productForEdit.address;
        this.productTypeOfSale = this.productForEdit.productTypeOfSale;
        this.productStatus = this.productForEdit.productStatus;
        this.productValidity = this.productForEdit.productValidity;
        //this.productImageURL = this.productForEdit.productImageURL[0];
        this.checkProductImage = this.productForEdit.productThumbNailImage;
        this.productImage1 = this.productForEdit.productImageURL[0];
        this.productImage2 = this.productForEdit.productImageURL[1];
        this.productImage3 = this.productForEdit.productImageURL[2];
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //------------------------------------------------ Edit POST ends---------------------------------------------------------------
  /*----------------------------------To update a product------------------------------*/

  updateProductRecord(
    productCategory: string,
    productID: string,
    productTitle: string,
    productPrice: string,
    productUnit: string,
    productDescription: string,
    address: string,
    productTypeOfSale: string,
    productStatus: string,
    productValidity: string,
    date: string,
    isApproved: boolean,
    profileID: string,
    productImageData: File[],
    productThumbNailImage: File | null
  ) {
    let formData = new FormData();
    //Append to formData
    console.log('adress for update' + address);
    formData.append('productCategory', productCategory);
    formData.append('productID', productID);
    formData.append('productTitle', productTitle);
    formData.append('productPrice', productPrice);
    formData.append('productUnit', productUnit);
    formData.append('productDescription', productDescription);
    // formData.append('address', address = this.address);
    formData.append('isApproved', isApproved.toString());
    formData.append('productTypeOfSale', productTypeOfSale);
    formData.append('productStatus', productStatus);
    formData.append('productValidity', productValidity);
    formData.append('latitude', this.latitude.toString());
    formData.append('longitude', this.longitude.toString());
    formData.append('date', date);
    formData.append('profileID', this.profileID);
    for (let i = 0; i < this.productImageData.length; i++) {
      formData.append('productImageData', this.productImageData[i]);
      console.log('images for edit', this.productImageData);
    }

    // Append listingImage to formData
    if (productThumbNailImage) {
      formData.append('productThumbNailImage', productThumbNailImage);

      console.log('THUMBBB', productThumbNailImage);
    }

    console.log('The product Title updated is', productTitle);
    console.log('The product Address updated is', address);
    if (this.productForEdit) {
      // Update existing data record
      this.http
        .put(BACKEND_URL + `/update/${this.productForEdit._id}`, formData)
        .subscribe(
          (response) => {
            Swal.fire({
              title: 'Successfully updated! 😀',
              text: 'Your post will go live after approval.',
              icon: 'success',

              confirmButtonText: 'Okay',
              confirmButtonColor: 'rgb(38 117 79)',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/profile']);
             location.reload();
                // For more information about handling dismissals please visit
                // https://sweetalert2.github.io/#handling-dismissals
              }
            });
          },
          (error) => {
            Swal.fire({
              title: 'Update failed 🙄',

              icon: 'error',

              confirmButtonText: 'Okay',
              confirmButtonColor: 'rgb(38 117 79)',
            }).then((result) => {
              if (result.isConfirmed) {
                // For more information about handling dismissals please visit
                // https://sweetalert2.github.io/#handling-dismissals
              }
            });
          
            // Handle error response here
          }
        );
    }
  }

  //-------------------------------------*****************------------------------------------

  //----------------------------------------------------------------ADDING SERVICES----------------------------------------------------------------

  //Declare an empty array and default values of input to null.
  serviceArray: any[] = [];
  currentServiceDatabaseID = '';
  serviceCategoryIdValue = '';

  //for Schema
  serviceCategory: string = 'ID_FRM';
  serviceID: string = '';
  serviceTitle: string = '';
  serviceDescription: string = '';
  serviceStatus: string = 'Active';
  serviceValidity: number = 180;

  //Declare the Function to retreive all the data from the database
  getAllService() {
    this.http.get(BACKEND_URL + '/getService').subscribe((resultData: any) => {
      console.log(resultData);
      this.serviceArray = resultData.data;
      console.log('service Array is: ', this.serviceArray);
    });
  }

  //-------------------------------------SERVICES Image Upload Button------------------------------------

  // selectedServiceImageUrls: (string | ArrayBuffer)[] = [];
  // serviceImage: File[] = [];
  // serviceThumbNailImage: File | undefined;

  // onServiceImageFileSelected(event, index) {
  //   console.log(event);
  //   const file = event.target.files[0];
  //   this.serviceCompressImage(file)
  //     .then((compressedFile) => {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         this.selectedServiceImageUrls[index] = reader.result;
  //       };
  //       reader.readAsDataURL(compressedFile as Blob);

  //       const compressedFileName = file.name;
  //       const compressedImageFile = new File(
  //         [compressedFile as Blob],
  //         compressedFileName
  //       );
  //       this.serviceImage[index] = compressedImageFile;

  //       if (index === 0) {
  //         this.serviceCompressFurtherImage(compressedImageFile)
  //           .then((furtherCompressedFile) => {
  //             this.serviceThumbNailImage = furtherCompressedFile;
  //           })
  //           .catch((error) => {
  //             console.error('Listing image compression error:', error);
  //           });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Image compression error:', error);
  //     });
  // }

  selectedServiceImageUrls: (string | ArrayBuffer)[] = [];
  serviceImage: File[] = [];
  serviceThumbNailImage: File | undefined;

  onServiceImageFileSelected(event, index) {
    console.log(event);
    const file = event.target.files[0];
    this.serviceCompressImage(file, index)
      .then((compressedFile) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedServiceImageUrls[index] = reader.result;
        };
        reader.readAsDataURL(compressedFile as Blob);

        const compressedFileName = this.getCompressedImageService(index);
        const compressedImageFile = new File(
          [compressedFile as Blob],
          compressedFileName
        );
        this.serviceImage[index] = compressedImageFile;

        if (index === 0) {
          this.serviceCompressFurtherImage(compressedImageFile)
            .then((furtherCompressedFile) => {
              this.serviceThumbNailImage = furtherCompressedFile;
            })
            .catch((error) => {
              console.error('Listing image compression error:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Image compression error:', error);
      });
    if (index === 0) {
      this.uploadButton1Enabled = true;
      this.uploadButton2Enabled = !this.editServiceDBID;
    } else if (index === 1) {
      this.uploadButton2Enabled = true;
      this.uploadButton3Enabled = !this.editServiceDBID;
    } else if (index === 2) {
      this.uploadButton3Enabled = true;
      // Enable the upload button for the previous index (index - 1)
      this.uploadButton2Enabled = true;
    }
  }

  getCompressedImageService(index) {
    const serviceID = this.serviceID; // Replace with the actual profile ID variable
    return `${serviceID}_image${index + 1}`;
  }
  serviceCompressImage(file, index) {
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
                      'compressed_image_' + file.name
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
  serviceCompressFurtherImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          let width = image.width;
          let height = image.height;

          if (file.size > 300 * 1024) {
            const maxSize = 150;
            if (width > height) {
              height *= maxSize / width;
              width = maxSize;
            } else {
              width *= maxSize / height;
              height = maxSize;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, width, height);

            canvas.toBlob(
              (blob: Blob) => {
                const furtherCompressedFile = new File(
                  [blob],
                  this.serviceID + '_thumbnailImage.jpg'
                );
                resolve(furtherCompressedFile);
              },
              'image/jpeg',
              1
            );
          } else {
            // If the image size is smaller or equal to 300 KB, perform only square cropping
            const size = Math.min(width, height);
            const xOffset = (width - size) / 2;
            const yOffset = (height - size) / 2;
            const squareSize = 150;

            canvas.width = squareSize;
            canvas.height = squareSize;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(
              image,
              xOffset,
              yOffset,
              size,
              size,
              0,
              0,
              squareSize,
              squareSize
            );

            canvas.toBlob(
              (blob: Blob) => {
                const croppedFile = new File(
                  [blob],
                  this.serviceID + '_thumbnailImage.jpg'
                );
                resolve(croppedFile);
              },
              'image/jpeg',
              1
            );
          }
        };
        image.src = event.target.result;
      };
      reader.onerror = (error) => {
        console.error('Listing image file reading error:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  //-------------------------------------SERVICES Save Button------------------------------------
  //Function to Create/Save data to the Database using the register() which works if currentStudentID is null; else it will do UpdateRecords().
  //This Function is called onclick of Save button.
  saveService() {
    if (this.currentServiceDatabaseID == '') {
      if (this.serviceTitle != '') {
        this.registerService(
          (this.date = new Date().toISOString().substr(0, 10).toString()),
          this.serviceCategory,
          this.serviceID,
          this.serviceTitle,
          this.serviceDescription,
          this.userCategory,
          this.profileID,
          this.address,
          this.serviceStatus,
          this.serviceValidity.toString(),
          this.serviceImage,
          this.serviceThumbNailImage
        ).subscribe(
          () =>

          Swal.fire({
            title: 'Successfully Posted! 😀',
            text: 'Your post will go live after approval.',
            icon: 'success',

            confirmButtonText: 'Okay',
            confirmButtonColor: 'rgb(38 117 79)',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/profile']);
            location.reload()
              // For more information about handling dismissals please visit
              // https://sweetalert2.github.io/#handling-dismissals
            }
          }),

           
          (error: HttpErrorResponse) => {
            // Handle error, e.g., show an error message, log the error, etc.
            console.log(error);
            if (error.status === 403) {
              Swal.fire({
                title: 'Alert',
                text: ' Your posting limit has been reached',
                icon: 'warning',

                confirmButtonText: 'Okay',
                confirmButtonColor: 'rgb(38 117 79)',
              }).then((result) => {
                if (result.isConfirmed) {
                  // For more information about handling dismissals please visit
                  // https://sweetalert2.github.io/#handling-dismissals
                }
              });
            } else {
              Swal.fire({
                title: 'Posting failed! 🙄',
                text: ' ',
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
          }
        );
        this.goToProfile();
      } else {
        Swal.fire({
          title: 'Alert',
          text: ' Please enter all required fields 🥸 (Category, Service title)',
          icon: 'warning',

          confirmButtonText: 'Okay',
          confirmButtonColor: 'rgb(38 117 79)',
        }).then((result) => {
          if (result.isConfirmed) {
            // For more information about handling dismissals please visit
            // https://sweetalert2.github.io/#handling-dismissals
          }
        });
      
      }
    } else {
      this.updateServiceRecord(
        this.serviceCategory,
        this.serviceID,
        this.serviceTitle,
        this.address,
        this.serviceDescription,
        (this.serviceStatus = 'Active'),
        this.serviceValidity.toString(),
        (this.date = new Date().toISOString().substr(0, 10).toString()),
        this.isApproved,
        this.profileID,
        this.serviceImage,
        this.serviceThumbNailImage
      );

      this.goToProfile();
    }
  }

  registerService(
    date: string,
    serviceCategory: string,
    serviceID: string,
    serviceTitle: string,
    serviceDescription: string,
    userCategory,
    profileID: string,
    address: string,
    serviceStatus: string,
    serviceValidity: string,
    serviceImageData: File[],
    serviceThumbNailImage: File | null
  ) {
    let formData = new FormData();
    //Append to formData
    formData.append('date', date);
    formData.append('serviceCategory', serviceCategory);
    formData.append('serviceID', serviceID);
    formData.append('serviceTitle', serviceTitle);
    formData.append('serviceDescription', serviceDescription);
    formData.append('userCategory', userCategory);
    formData.append('profileID', profileID);
    formData.append('address', address);
    formData.append('serviceStatus', serviceStatus);
    formData.append('serviceValidity', serviceValidity);
    formData.append('latitude', this.latitude.toString());
    formData.append('longitude', this.longitude.toString());

    // Append each selected file to the FormData object
    for (let i = 0; i < this.serviceImage.length; i++) {
      formData.append('images', this.serviceImage[i]);
    }
    if (serviceThumbNailImage) {
      formData.append('images', serviceThumbNailImage);
    }
    //*** */
    //Console log
    console.log('upload image file: ', serviceImageData);
    console.log(' The form data is:-----', formData);
    //*** */

    return this.http.post(BACKEND_URL + '/addService', formData, {
      responseType: 'text',
    });
  }

  //-------------------------------------*****************------------------------------------
  //------------------------------------------------ To Edit POST---------------------------------------------------------------
  editServiceDBID: any = null;
  editServiceImagesArray: any[] = [];
  serviceForEdit: any;
  checkServiceImage: string = '';
  fetchService(ID: string) {
    // Assuming BACKEND_URL is defined elsewhere in your code
    this.http.get(BACKEND_URL + `/getService/${ID}`).subscribe(
      (response: any) => {
        // Check if the response has a 'services' property
        if (response.services) {
          this.serviceForEdit = response.services;
          console.log('Service For Edit:', this.serviceForEdit);

          // Assign values directly from the response
          this.currentServiceDatabaseID = this.serviceForEdit._id;
          this.editServiceDBID = this.serviceForEdit._id;
          this.serviceCategory = this.serviceForEdit.serviceCategory;
          this.serviceID = this.serviceForEdit.serviceID;
          this.serviceTitle = this.serviceForEdit.serviceTitle;
          this.serviceDescription = this.serviceForEdit.serviceDescription;
          this.serviceStatus = this.serviceForEdit.serviceStatus;
          this.serviceValidity = this.serviceForEdit.serviceValidity;
          this.checkServiceImage = this.serviceForEdit.serviceThumbNailImage;

          // Ensure the property exists before assigning it
          if (
            this.serviceForEdit.serviceImageURL &&
            this.serviceForEdit.serviceImageURL[0]
          ) {
            this.serviceImage1 = this.serviceForEdit.serviceImageURL[0];
          }
          if (
            this.serviceForEdit.serviceImageURL &&
            this.serviceForEdit.serviceImageURL[1]
          ) {
            this.serviceImage2 = this.serviceForEdit.serviceImageURL[1];
          }
          if (
            this.serviceForEdit.serviceImageURL &&
            this.serviceForEdit.serviceImageURL[2]
          ) {
            this.serviceImage3 = this.serviceForEdit.serviceImageURL[2];
          }
        } else {
          console.error('Invalid response format');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //------------------------------------------------ Edit POST ends---------------------------------------------------------------

  /*----------------------------------To update a product------------------------------*/

  updateServiceRecord(
    serviceCategory: string,
    serviceID: string,
    serviceTitle: string,
    address: string,
    serviceDescription: string,
    serviceStatus: string,
    serviceValidity: string,
    date: string,
    isApproved: boolean,
    profileID: string,
    serviceImageData: File[],
    serviceThumbNailImage: File | null
  ) {
    let formData = new FormData();
    //Append to formData

    formData.append('serviceCategory', serviceCategory);
    formData.append('serviceID', serviceID);
    formData.append('serviceTitle', serviceTitle);
    formData.append('serviceDescription', serviceDescription);
    formData.append('address', (address = this.address));
    formData.append('serviceStatus', serviceStatus);
    formData.append('serviceValidity', serviceValidity);
    formData.append('latitude', this.latitude.toString());
    formData.append('longitude', this.longitude.toString());
    formData.append('date', date);
    formData.append('isApproved', isApproved.toString());
    formData.append('profileID', this.profileID);

    for (let i = 0; i < serviceImageData.length; i++) {
      formData.append('serviceImageData', serviceImageData[i]);
    }
    console.log(' this.serviceForEdit.serviceImageData[]', serviceImageData);
    console.log('the value of the profileId', this.profileID);

    if (serviceThumbNailImage) {
      formData.append('serviceThumbNailImage', serviceThumbNailImage);

      console.log('THUMBBB', serviceThumbNailImage);
    }

    console.log('The Service Title updated is', serviceTitle);
    if (this.serviceForEdit) {
      // Update existing data record
      this.http
        .put(
          BACKEND_URL + `/updateService/${this.serviceForEdit._id}`,
          formData
        )
        .subscribe(
          (response) => {
            Swal.fire({
              title: 'Successfully updated! 😀',
              text: 'Your post will go live after approval.',
              icon: 'success',

              confirmButtonText: 'Okay',
              confirmButtonColor: 'rgb(38 117 79)',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/profile']);
                location.reload()
                // For more information about handling dismissals please visit
                // https://sweetalert2.github.io/#handling-dismissals
              }
            });
          },
          (error) => {
            Swal.fire({
              title: 'Update failed 🙄',

              icon: 'error',

              confirmButtonText: 'Okay',
              confirmButtonColor: 'rgb(38 117 79)',
            }).then((result) => {
              if (result.isConfirmed) {
                // For more information about handling dismissals please visit
                // https://sweetalert2.github.io/#handling-dismissals
              }
            });
          
            // Handle error response here
          }
        );
    }
  }

  //-------------------------------------*****************------------------------------------

  //------------------------------------Select Category Page----------------------------
  /*to scroll to the top*/

  selectedCategoryID: String = null;
  selectedCategoryName: String = '';

  // Component code
  nextButtonDisabled = true;
  productCategoryTemp: string = null;
  productCategoryNameTemp: string = 'Select product category';
  selectButton(selectedCategoryID: string, category: string): void {
    // Set the selected category name
    this.productCategoryNameTemp = category;

    // Set the selected category ID
    this.productCategoryTemp = selectedCategoryID;

    // console values
    console.log('Selected Category Name ' + this.productCategoryName);
    console.log('Selected Category ID: ' + this.productCategory);
  }

  @HostListener('document:click', ['$event.target'])
  onClick(): void {
    const productButtonsAreas =
      this.elementRef.nativeElement.querySelectorAll('.productButtons');
    const nextButton = document.querySelector('.btn-next');

    let clickedOutside = true;
    for (let i = 0; i < productButtonsAreas.length; i++) {
      const productButtonsArea = productButtonsAreas[i];
      if (productButtonsArea.contains(event.target as Node)) {
        clickedOutside = false;
        break;
      }
    }

    if (clickedOutside) {
      // Clicked outside any product buttons area

      // Disable the Next button
      if (nextButton) {
        nextButton.setAttribute('disabled', 'disabled');
        // Reset the selected category name and ID
        this.productCategoryName = this.productCategoryNameTemp =
          'Select product category';

        this.productCategory = null;
      }

      console.log('Selected Category Name ' + this.productCategoryName);
      console.log('Selected Category ID: ' + this.productCategory);
    }
  }

  next() {
    this.showSelectCategory = false;
    this.showPostItem = true;
    this.productCategory = this.productCategoryTemp;
    this.productCategoryName = this.productCategoryNameTemp;
  }

  selectCategoryForEdit() {
    switch (this.productCategory) {
      case 'ID_FNV':
        this.productCategoryName = 'Farm produce/Fruits and Veg';
        break;
      case 'ID_EGG':
        this.productCategoryName = 'Farm produce/Eggs';
        break;
      case 'ID_FNM':
        this.productCategoryName = 'Farm produce/Fish & Meat';
        break;
      case 'ID_SAO':
        this.productCategoryName = 'Farm produce/Spices and Oils';
        break;
      case 'ID_PUS':
        this.productCategoryName = 'Farm produce/Pulses';
        break;
      case 'ID_CRL':
        this.productCategoryName = 'Farm produce/Cereals';
        break;
      case 'ID_FPO':
        this.productCategoryName = 'Farm produce/Others';
        break;
      case 'ID_CNB':
        this.productCategoryName = 'Home Produce/Cakes and Bakes';
        break;
      case 'ID_CNS':
        this.productCategoryName = 'Home Produce/Chips and Snacks';
        break;
      case 'ID_RNB':
        this.productCategoryName = 'Home Produce/Meals';
        break;
      case 'ID_HYS':
        this.productCategoryName = 'Home Produce/Healthy Snacks';
        break;
      case 'ID_PKS':
        this.productCategoryName = 'Home Produce/Pickles';
        break;
      case 'ID_OHS':
        this.productCategoryName = 'Home Produce/Others';
        break;
      case 'ID_PLS':
        this.productCategoryName = 'Garden/Plants';
        break;
      case 'ID_SES':
        this.productCategoryName = 'Garden/Seeds';
        break;
      case 'ID_NUY':
        this.productCategoryName = 'Garden/Nursery';
        break;
      case 'ID_OTS':
        this.productCategoryName = 'Garden/Others';
        break;
      case 'ID_DGS':
        this.productCategoryName = 'Pets/Dogs';
        break;
      case 'ID_CTS':
        this.productCategoryName = 'Pets/Cats';
        break;
      case 'ID_BDS':
        this.productCategoryName = 'Pets/Birds';
        break;
      case 'ID_OLF':
        this.productCategoryName = 'Pets/Ornamental fish';
        break;
      case 'ID_OES':
        this.productCategoryName = 'Pets/Others';
        break;
      case 'ID_CAE':
        this.productCategoryName = 'Livestock/Cattle';
        break;
      case 'ID_GNS':
        this.productCategoryName = 'Livestock/Goats and Sheep';
        break;
      case 'ID_HES':
        this.productCategoryName = 'Livestock/Poultry';
        break;
      case 'ID_ORS':
        this.productCategoryName = 'Livestock/Others';
        break;
      case 'ID_HEA':
        this.productCategoryName = 'Used Items/Home appliance';
        break;
      case 'ID_ELC':
        this.productCategoryName = 'Used Items/Electronics';
        break;
      case 'ID_AUS':
        this.productCategoryName = 'Used Items/Autos';
        break;
      case 'ID_OHE':
        this.productCategoryName = 'Used Items/Others';
        break;

      default:
        this.productCategoryName = 'Select product category';
        break;
    }
  }
}
