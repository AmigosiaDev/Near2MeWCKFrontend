import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterUserCategoryComponent } from './enter-user-category.component';

describe('EnterUserCategoryComponent', () => {
  let component: EnterUserCategoryComponent;
  let fixture: ComponentFixture<EnterUserCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterUserCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterUserCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
