import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KurzusComponent } from './kurzus.component';

describe('KurzusComponent', () => {
  let component: KurzusComponent;
  let fixture: ComponentFixture<KurzusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KurzusComponent]
    });
    fixture = TestBed.createComponent(KurzusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
