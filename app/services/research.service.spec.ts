import { TestBed, inject } from '@angular/core/testing';

import { ResearchService } from './research.service';

describe('ResearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResearchService]
    });
  });

  it(
    'should be created',
    inject([ResearchService], (service: ResearchService) => {
      expect(service).toBeTruthy();
    })
  );
});
