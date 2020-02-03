import { TestBed, inject } from '@angular/core/testing';

import { RowColumnSorter } from './row-column-sorter.service';

describe('RowColumnSorter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RowColumnSorter]
    });
  });

  it(
    'should ...',
    inject([RowColumnSorter], (service: RowColumnSorter) => {
      expect(service).toBeTruthy();
    })
  );
});
