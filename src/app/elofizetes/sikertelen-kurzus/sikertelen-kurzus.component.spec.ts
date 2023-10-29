import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SikertelenKurzusComponent } from './sikertelen-kurzus.component';

describe('SikertelenKurzusComponent', () => {
  let component: SikertelenKurzusComponent;
  let fixture: ComponentFixture<SikertelenKurzusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SikertelenKurzusComponent]
    });
    fixture = TestBed.createComponent(SikertelenKurzusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
