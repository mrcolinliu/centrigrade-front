import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TickButtonComponent } from './tick-button.component';

describe('TickButtonComponent', () => {
  let component: TickButtonComponent;
  let fixture: ComponentFixture<TickButtonComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [TickButtonComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TickButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
