import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllServicesComponent } from './show-all-services.component';

describe('ShowAllServicesComponent', () => {
  let component: ShowAllServicesComponent;
  let fixture: ComponentFixture<ShowAllServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAllServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAllServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
