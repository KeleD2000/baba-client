import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabafeszkeloComponent } from './babafeszkelo.component';

describe('BabafeszkeloComponent', () => {
  let component: BabafeszkeloComponent;
  let fixture: ComponentFixture<BabafeszkeloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BabafeszkeloComponent]
    });
    fixture = TestBed.createComponent(BabafeszkeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
