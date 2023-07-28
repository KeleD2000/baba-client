import { TestBed } from '@angular/core/testing';

import { HtmlconvertService } from './htmlconvert.service';

describe('HtmlconvertService', () => {
  let service: HtmlconvertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlconvertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
