/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Footer } from './footer.service';

describe('FooterTitleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Footer]
    });
  });

  it(
    'should ...',
    inject([Footer], (service: Footer) => {
      expect(service).toBeTruthy();
    })
  );
});
