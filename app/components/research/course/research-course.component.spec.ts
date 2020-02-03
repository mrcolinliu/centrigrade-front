import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchCourseComponent } from './research-course.component';

describe('ResearchCourseComponent', () => {
  let component: ResearchCourseComponent;
  let fixture: ComponentFixture<ResearchCourseComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ResearchCourseComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
