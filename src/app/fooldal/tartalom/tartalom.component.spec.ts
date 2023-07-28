import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TartalomComponent } from './tartalom.component';

describe('TartalomComponent', () => {
  let component: TartalomComponent;
  let fixture: ComponentFixture<TartalomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TartalomComponent]
    });
    fixture = TestBed.createComponent(TartalomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
