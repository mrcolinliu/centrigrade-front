/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuestionnaireCompleteComponent } from './questionnaire-complete.component';

describe('QuestionnaireCompleteComponent', () => {
  let component: QuestionnaireCompleteComponent;
  let fixture: ComponentFixture<QuestionnaireCompleteComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [QuestionnaireCompleteComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
