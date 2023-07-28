import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbpComponent } from './fbp.component';

describe('FbpComponent', () => {
  let component: FbpComponent;
  let fixture: ComponentFixture<FbpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FbpComponent]
    });
    fixture = TestBed.createComponent(FbpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
