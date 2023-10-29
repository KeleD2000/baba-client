import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsszegzesComponent } from './osszegzes.component';

describe('OsszegzesComponent', () => {
  let component: OsszegzesComponent;
  let fixture: ComponentFixture<OsszegzesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OsszegzesComponent]
    });
    fixture = TestBed.createComponent(OsszegzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
