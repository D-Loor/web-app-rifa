import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimiteComponent } from './limite.component';

describe('LimiteComponent', () => {
  let component: LimiteComponent;
  let fixture: ComponentFixture<LimiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LimiteComponent]
    });
    fixture = TestBed.createComponent(LimiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
