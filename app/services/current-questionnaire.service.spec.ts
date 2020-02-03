import { TestBed, inject } from '@angular/core/testing';

import { CurrentQuestionnaireService } from './current-questionnaire.service';

describe('CurrentQuestionnaireService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentQuestionnaireService]
    });
  });

  it(
    'should be created',
    inject([CurrentQuestionnaireService], (service: CurrentQuestionnaireService) => {
      expect(service).toBeTruthy();
    })
  );
});
