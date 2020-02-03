/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReviewQuestionsComponent } from './review-questions.component';

describe('ReviewQuestionsComponent', () => {
  let component: ReviewQuestionsComponent;
  let fixture: ComponentFixture<ReviewQuestionsComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ReviewQuestionsComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
