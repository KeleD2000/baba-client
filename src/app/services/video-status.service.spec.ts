import { TestBed } from '@angular/core/testing';

import { VideoStatusService } from './video-status.service';

describe('VideoStatusService', () => {
  let service: VideoStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
