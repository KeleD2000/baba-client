import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoStatusService {
  private videoEndedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public videoEnded$ = this.videoEndedSubject.asObservable();

  setVideoEnded(value: boolean) {
    this.videoEndedSubject.next(value);
  }
}
