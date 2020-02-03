/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VerticalProgressIndicatorComponent } from './vertical-progress-indicator.component';

describe('VerticalProgressIndicatorComponent', () => {
  let component: VerticalProgressIndicatorComponent;
  let fixture: ComponentFixture<VerticalProgressIndicatorComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [VerticalProgressIndicatorComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalProgressIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
