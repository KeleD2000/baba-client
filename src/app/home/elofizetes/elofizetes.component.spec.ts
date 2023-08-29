import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElofizetesComponent } from './elofizetes.component';

describe('ElofizetesComponent', () => {
  let component: ElofizetesComponent;
  let fixture: ComponentFixture<ElofizetesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElofizetesComponent]
    });
    fixture = TestBed.createComponent(ElofizetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
