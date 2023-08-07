import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideotarComponent } from './videotar.component';

describe('VideotarComponent', () => {
  let component: VideotarComponent;
  let fixture: ComponentFixture<VideotarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideotarComponent]
    });
    fixture = TestBed.createComponent(VideotarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
