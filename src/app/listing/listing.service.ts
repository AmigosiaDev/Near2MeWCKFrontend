import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  constructor() { }
  searchedItems:any[]=[];
  quickLink:any=[];
  currentPage:any=1;
}
