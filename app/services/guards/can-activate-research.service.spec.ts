import { TestBed, inject } from '@angular/core/testing';

import { CanActivateResearchService } from './can-activate-research.service';

describe('CanActivateResearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateResearchService]
    });
  });

  it(
    'should be created',
    inject([CanActivateResearchService], (service: CanActivateResearchService) => {
      expect(service).toBeTruthy();
    })
  );
});
