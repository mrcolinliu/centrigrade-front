/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CourseAreaBudgetFilterComponent } from './course-area-budget-filter.component';

describe('CourseAreaBudgetFilterComponent', () => {
  let component: CourseAreaBudgetFilterComponent;
  let fixture: ComponentFixture<CourseAreaBudgetFilterComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CourseAreaBudgetFilterComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseAreaBudgetFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
