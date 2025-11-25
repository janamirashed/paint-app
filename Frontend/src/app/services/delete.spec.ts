import { TestBed } from '@angular/core/testing';

import { Delete } from './delete';

describe('Delete', () => {
  let service: Delete;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Delete);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
