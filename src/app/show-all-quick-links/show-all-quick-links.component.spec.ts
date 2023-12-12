import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllQuickLinksComponent } from './show-all-quick-links.component';

describe('ShowAllQuickLinksComponent', () => {
  let component: ShowAllQuickLinksComponent;
  let fixture: ComponentFixture<ShowAllQuickLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAllQuickLinksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAllQuickLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
