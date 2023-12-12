import { Component, OnInit, HostListener } from '@angular/core';
import { debounce } from 'lodash';
//Other imports
import { AuthUserService } from '../auth-user.service';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common'; //Used for Back Button
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'angular-web-storage';
import { Router, ActivatedRoute } from '@angular/router';
//For Image Upload

//To import the environment files
import { environment } from '../..//environments/environment';
//SweetAlert2
import Swal from 'sweetalert2';
const BACKEND_URL = environment.apiUrl;

interface productInterface {
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
  productTypeOfSale: {
    type: String;
    required: true;
  };
  productStatus: {
    type: String;
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
  serviceStatus: {
    type: String;
    required: true;
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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  //Go Back to previous page  Function
  goBack(): void {
    this.location.back();
  }

  isZoomed: boolean = false;
  toggleImageZoom() {
    this.isZoomed = !this.isZoomed;
  }
  closeImageZoom() {
    this.isZoomed = false;
  }

  //Scroll to section on click of Active Ads, Inactive Ads
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  //Declare an empty array and default values of input to null.
  currentNewUserDatabaseID = '';
  //For schema
  userPhoneNumber: number = null;
  userName: string = '';
  users: any;
  //userName: string = null;
  mobileNumber: string = null;
  passedId: string = null;
  address: string = null;
  areaOfInterest: string = null;
  category: string = null;
  about: string = '';
  userMobile: string = null;
  whatsApp: string = null;
  profileID: string = null;
  imageURL: string = null;
  refreshProfilePage: boolean = false;
  userImageURL: any = [];
  constructor(
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private datePipe: DatePipe,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private AuthUserService: AuthUserService
  ) {}

  ngOnInit(): void {
    //To Check Authentication

    this.AuthUserService.authUser();
    this.userMobile = this.localStorage.get('passedPhoneNumber');
    this.profileID = localStorage.getItem('profileID');

    console.log('userMobile', this.userMobile);

    console.log('profileID', this.profileID);
    if (this.profileID) {
      this.getAllListing();
    }

    //this.getAllServices();
    this.fetchUsers();
    this.route.queryParams.subscribe((params) => {
      this.refreshProfilePage = params['refreshProfilePage'];
      console.log('this.refreshProfilePage', this.refreshProfilePage);
    });

    if (this.refreshProfilePage == true) {
      //this.getAllListing();
      location.reload();
    }
  }

  // this.http.get(`http://localhost:3000/get-username`).subscribe((response)=>{
  //   console.log(response,"response usrdatsa")
  //       }),

  fetchUsers(): void {
    //The token goes with HTTP (using http interceptor :-src\app\login\auth.interceptor.ts)
    this.http.get(`${BACKEND_URL}/getuser`).subscribe(
      (response) => {
        this.users = response;
        console.log('this.users', this.users);

        this.mobileNumber = this.users.mobile;
        this.whatsApp = this.users.whatsApp;
        this.userName = this.users.username;
        // this.passedId = this.users[0]._id;
        this.address = this.users.address;
        this.areaOfInterest = this.users.areaOfInterest;
        this.category = this.users.category;
        if (this.users.about !== 'undefined') {
          this.about = this.users.about;
        }

        for (let i = 0; i < this.users.userImageURL.length; i++) {
          if (this.users.userImageURL[i]) {
            this.userImageURL[i] = this.users.userImageURL[i];
            console.log('USERIMAGEURL' + this.userImageURL[i]);
          }
        }

        console.log('ABOUTTTTTTTTTTT' + this.users.about);

        this.imageURL = this.users.profileImageURL;
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }

  goToEditProfile() {
    this.router.navigate(['/edit-details'], {
      queryParams: { passedDbId: this.passedId },
    });
  }

  //For getting Recently Added

  listingArray: any[] = [];

  products: productInterface[] = [];
  //pagination
  currentPage = 1;
  isFetchingData = false;
  limit = 20;

  @HostListener('window:scroll', ['$event'])
  onScroll = debounce(() => {
    const scrollPosition = window.innerHeight + window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight;

    if (!this.isFetchingData && scrollPosition >= documentHeight - 100) {
      this.isFetchingData = true;

      console.log('Hello World! You reached the bottom of the screen.');
      this.currentPage++;
      if (this.profileID) {
        this.getAllListing();
      }
      // Set a timeout to reset the flag after a short delay (e.g., 500ms)
      setTimeout(() => {
        this.isFetchingData = false;
      }, 500);
    }
  }, 300); // Adjust the debounce delay (in milliseconds) as needed

  // Declare the Function to retrieve and sort all the data from the database
  getAllListing() {
    this.http
      .get(
        BACKEND_URL +
          `/getAllUserProducts/${this.profileID}?&page=${this.currentPage}&limit=${this.limit}`
      )
      .subscribe((listingData: any) => {
        console.log('get All Product Data:', listingData);
        this.listingArray = [...this.listingArray, ...listingData];

        console.log('product Array is: ', this.listingArray);

        // Reset the flag after processing the data
      });
  }

  // To
  formatDate(date: string): string {
    const formattedDate = this.datePipe.transform(date, 'dd-MM-yyyy');
    return formattedDate || '';
  }

  //Function to Delete data from the Database
  setDelete(productData: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      confirmButtonColor: 'rgb(231 98 98)',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .delete(BACKEND_URL + '/deleteProduct/' + productData._id)
          .subscribe(() => {
            this.products = this.products.filter(
              (u) => productData._id !== productData._id
            );
            if (this.profileID) {
              this.getAllListing();
            }
          });
        location.reload();
        
      }
    });
  }

  //DEACTIVATE/ ACTIVATE product

  // Deactivate a Product by changing productStatus from "Active" to "Inactive".
  deactivateProduct(productData: any) {
    this.http
      .put(BACKEND_URL + `/deactivateProduct/${productData._id}`, {
        deactivate: true,
        isApproved: false,
      })
      .subscribe(
        (updatedProduct) => {
          // Handle the response if needed

          Swal.fire({
            title: 'Deactivated',
            text: ' Your product has been deactivated.',
            icon: 'info',
            confirmButtonColor: 'rgb(38 117 79)',
            confirmButtonText: 'Okay',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/profile']);
              location.reload();
              // For more information about handling dismissals please visit
              // https://sweetalert2.github.io/#handling-dismissals
            }
          });
          if (this.profileID) {
            this.getAllListing();
          }
        },
        (error) => {
          // Handle any errors
          console.error(error);
        }
      );
    location.reload();
  }

  // To Edit products
  editProduct: any;
  editProductID: any;
  editingProduct: boolean = false;

  editProducts(product: productInterface) {
    this.editProduct = { ...product };
    this.editingProduct = true;
    console.log('this.editProduct ID is:', this.editProduct._id);
    this.editProductID = this.editProduct._id;
    //this.imagePreview = BACKEND_URL+'/images/products/' + product.productImageData;
    this.router.navigate(['/post-item'], {
      queryParams: { passedProductDBID: this.editProductID, profilePage: true },
    });
  }

  /*------------------------------------------------SERVICES--------------------------------------------------------------------------------*/
  //For getting Recently Added

  serviceArray: any[] = [];

  services: productInterface[] = [];

  // Declare the Function to retrieve and sort all the data from the database
  getAllServices() {
    this.http
      .get(BACKEND_URL + '/getAllServices')
      .subscribe((serviceData: any) => {
        console.log('get All Product Data:', serviceData);

        // Sort products by alphanumeric ID in reverse order
        serviceData.sort((a: any, b: any) => {
          const idA = a.serviceID.replace(/[^a-zA-Z0-9]/g, '');
          const idB = b.serviceID.replace(/[^a-zA-Z0-9]/g, '');
          return idB.localeCompare(idA);
        });

        this.serviceArray = serviceData.map((service: any) => {
          return {
            ...service,
            date: this.formatDate(service.date), // Format the date
          };
        });

        console.log('Service Array is: ', this.serviceArray);
      });
  }

  //DEACTIVATE/ ACTIVATE product

  // Deactivate a Product by changing productStatus from "Active" to "Inactive".
  deactivateService(serviceData: any) {
    this.http
      .put(BACKEND_URL + `/deactivateService/${serviceData._id}`, {
        deactivate: true,
        isApproved: false,
      })
      .subscribe(
        (updatedService) => {
          // Handle the response if needed

          Swal.fire({
            title: 'Deactivated',
            text: ' Your service has been deactivated.',
            icon: 'info',
            confirmButtonColor: 'rgb(38 117 79)',
            confirmButtonText: 'Okay',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/profile']);
              location.reload();
              // For more information about handling dismissals please visit
              // https://sweetalert2.github.io/#handling-dismissals
            }
          });
          this.getAllServices();
        },
        (error) => {
          // Handle any errors
          console.error(error);
        }
      );
    location.reload();
  }

  //Function to Delete data from the Database
  serviceDelete(serviceData: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Service?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      confirmButtonColor: 'rgb(231 98 98)',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
     
        this.http
          .delete(BACKEND_URL + '/deleteService/' + serviceData._id)
          .subscribe(() => {
            this.services = this.services.filter(
              (u) => serviceData._id !== serviceData._id
            );
            this.getAllServices();
          });
        location.reload();
      
    });
  }

  // To Edit services
  editService: any;
  editServiceID: any;
  editingService: boolean = false;

  editServices(service: serviceInterface) {
    this.editService = { ...service };
    this.editingService = true;
    console.log('this.editService ID is:', this.editService._id);
    this.editServiceID = this.editService._id;

    this.router.navigate(['/post-item'], {
      queryParams: { passedServiceDBID: this.editServiceID },
    });
  }

  getUserCategory(userCategory: string) {
    switch (userCategory) {
      case 'ID_CAT_STO':
        return 'Store';
      case 'ID_CAT_KUD':
        return 'Kudumbasree';
      case 'ID_CAT_HOM':
        return 'Homemade';
      case 'ID_CAT_PRO':
        return 'Farm Produce';
      case 'ID_CAT_IND':
        return 'Cottage Industry';
      default:
        return 'Seller';
    }
  }
}
