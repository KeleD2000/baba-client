import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VidikComponent } from './vidik.component';

describe('VidikComponent', () => {
  let component: VidikComponent;
  let fixture: ComponentFixture<VidikComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VidikComponent]
    });
    fixture = TestBed.createComponent(VidikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
