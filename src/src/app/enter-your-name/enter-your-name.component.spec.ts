import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterYourNameComponent } from './enter-your-name.component';

describe('EnterYourNameComponent', () => {
  let component: EnterYourNameComponent;
  let fixture: ComponentFixture<EnterYourNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterYourNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterYourNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
