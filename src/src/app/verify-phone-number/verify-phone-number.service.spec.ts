import { TestBed } from '@angular/core/testing';

import { VerifyPhoneNumberService } from './verify-phone-number.service';

describe('VerifyPhoneNumberService', () => {
  let service: VerifyPhoneNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifyPhoneNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
