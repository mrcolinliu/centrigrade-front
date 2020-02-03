/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CourseAreaLanguagesFilterComponent } from './course-area-languages-filter.component';

describe('CourseAreaLanguagesFilterComponent', () => {
  let component: CourseAreaLanguagesFilterComponent;
  let fixture: ComponentFixture<CourseAreaLanguagesFilterComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CourseAreaLanguagesFilterComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseAreaLanguagesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
