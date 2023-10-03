import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViditekaComponent } from './viditeka.component';

describe('ViditekaComponent', () => {
  let component: ViditekaComponent;
  let fixture: ComponentFixture<ViditekaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViditekaComponent]
    });
    fixture = TestBed.createComponent(ViditekaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
