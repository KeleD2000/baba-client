import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdatkezelesComponent } from './adatkezeles.component';

describe('AdatkezelesComponent', () => {
  let component: AdatkezelesComponent;
  let fixture: ComponentFixture<AdatkezelesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdatkezelesComponent]
    });
    fixture = TestBed.createComponent(AdatkezelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
