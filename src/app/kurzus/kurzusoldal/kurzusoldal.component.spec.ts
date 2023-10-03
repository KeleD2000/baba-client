import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KurzusoldalComponent } from './kurzusoldal.component';

describe('KurzusoldalComponent', () => {
  let component: KurzusoldalComponent;
  let fixture: ComponentFixture<KurzusoldalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KurzusoldalComponent]
    });
    fixture = TestBed.createComponent(KurzusoldalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
