import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SikeresKurzusComponent } from './sikeres-kurzus.component';

describe('SikeresKurzusComponent', () => {
  let component: SikeresKurzusComponent;
  let fixture: ComponentFixture<SikeresKurzusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SikeresKurzusComponent]
    });
    fixture = TestBed.createComponent(SikeresKurzusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
