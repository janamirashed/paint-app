import { TestBed } from '@angular/core/testing';

import { LoadShapes } from './load-shapes';

describe('LoadShapes', () => {
  let service: LoadShapes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadShapes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
