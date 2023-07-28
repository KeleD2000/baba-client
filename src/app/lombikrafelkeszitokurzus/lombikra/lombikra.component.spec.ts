import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LombikraComponent } from './lombikra.component';

describe('LombikraComponent', () => {
  let component: LombikraComponent;
  let fixture: ComponentFixture<LombikraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LombikraComponent]
    });
    fixture = TestBed.createComponent(LombikraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
