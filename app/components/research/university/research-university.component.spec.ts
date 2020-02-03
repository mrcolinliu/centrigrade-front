import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchUniversityComponent } from './research-university.component';

describe('ResearchUniversityComponent', () => {
  let component: ResearchUniversityComponent;
  let fixture: ComponentFixture<ResearchUniversityComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ResearchUniversityComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchUniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
