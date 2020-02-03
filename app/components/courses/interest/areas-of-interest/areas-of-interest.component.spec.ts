/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AreasOfInterestComponent } from './areas-of-interest.component';

describe('AreasOfInterestComponent', () => {
  let component: AreasOfInterestComponent;
  let fixture: ComponentFixture<AreasOfInterestComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AreasOfInterestComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasOfInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
