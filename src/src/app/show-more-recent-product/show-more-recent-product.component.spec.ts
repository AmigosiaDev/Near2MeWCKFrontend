import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMoreRecentProductComponent } from './show-more-recent-product.component';

describe('ShowMoreRecentProductComponent', () => {
  let component: ShowMoreRecentProductComponent;
  let fixture: ComponentFixture<ShowMoreRecentProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowMoreRecentProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowMoreRecentProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
