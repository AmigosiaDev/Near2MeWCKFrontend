import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShowMoreService {
  constructor() {}
  showMoreItems: any[] = [];

  currentPage: any = 1;
  totalItems:number=0;
  scrollPosition: any = 0;
}
