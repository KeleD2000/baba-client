import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GyikComponent } from './gyik.component';

describe('GyikComponent', () => {
  let component: GyikComponent;
  let fixture: ComponentFixture<GyikComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GyikComponent]
    });
    fixture = TestBed.createComponent(GyikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
