import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolamComponent } from './rolam.component';

describe('RolamComponent', () => {
  let component: RolamComponent;
  let fixture: ComponentFixture<RolamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolamComponent]
    });
    fixture = TestBed.createComponent(RolamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
