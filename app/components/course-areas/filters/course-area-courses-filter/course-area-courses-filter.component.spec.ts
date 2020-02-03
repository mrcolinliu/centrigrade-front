/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CourseAreaCoursesFilterComponent } from './course-area-courses-filter.component';

describe('CourseAreaCoursesFilterComponent', () => {
  let component: CourseAreaCoursesFilterComponent;
  let fixture: ComponentFixture<CourseAreaCoursesFilterComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CourseAreaCoursesFilterComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseAreaCoursesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
