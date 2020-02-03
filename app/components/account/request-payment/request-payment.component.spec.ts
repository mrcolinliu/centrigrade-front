import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPaymentComponent } from './request-payment.component';

describe('RequestPaymentComponent', () => {
  let component: RequestPaymentComponent;
  let fixture: ComponentFixture<RequestPaymentComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [RequestPaymentComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
