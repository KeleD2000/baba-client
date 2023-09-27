import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KurzusadatokComponent } from './kurzusadatok.component';

describe('KurzusadatokComponent', () => {
  let component: KurzusadatokComponent;
  let fixture: ComponentFixture<KurzusadatokComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KurzusadatokComponent]
    });
    fixture = TestBed.createComponent(KurzusadatokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
