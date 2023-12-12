import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallPopupComponent } from './install-popup.component';

describe('InstallPopupComponent', () => {
  let component: InstallPopupComponent;
  let fixture: ComponentFixture<InstallPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
