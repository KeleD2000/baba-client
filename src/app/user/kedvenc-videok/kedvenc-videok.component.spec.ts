import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KedvencVideokComponent } from './kedvenc-videok.component';

describe('KedvencVideokComponent', () => {
  let component: KedvencVideokComponent;
  let fixture: ComponentFixture<KedvencVideokComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KedvencVideokComponent]
    });
    fixture = TestBed.createComponent(KedvencVideokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
