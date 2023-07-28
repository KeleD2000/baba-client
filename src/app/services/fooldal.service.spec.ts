import { TestBed } from '@angular/core/testing';

import { FooldalService } from './fooldal.service';

describe('FooldalService', () => {
  let service: FooldalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FooldalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
