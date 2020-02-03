import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareCoursesComponent } from './compare-courses.component';

describe('CompareCoursesComponent', () => {
  let component: CompareCoursesComponent;
  let fixture: ComponentFixture<CompareCoursesComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CompareCoursesComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
