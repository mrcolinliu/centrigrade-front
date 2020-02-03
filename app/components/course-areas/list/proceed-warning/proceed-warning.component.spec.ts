/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProceedWarningComponent } from './proceed-warning.component';

describe('ProceedWarningComponent', () => {
  let component: ProceedWarningComponent;
  let fixture: ComponentFixture<ProceedWarningComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ProceedWarningComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceedWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
