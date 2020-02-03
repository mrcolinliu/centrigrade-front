/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ForgottenLoginComponent } from './forgotten-login.component';

describe('ForgottenLoginComponent', () => {
  let component: ForgottenLoginComponent;
  let fixture: ComponentFixture<ForgottenLoginComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ForgottenLoginComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgottenLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
