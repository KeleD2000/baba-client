import { TestBed } from '@angular/core/testing';

import { CuoponIdService } from './cuopon-id.service';

describe('CuoponIdService', () => {
  let service: CuoponIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuoponIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
