import { TestBed } from '@angular/core/testing';

import { UpdateShape } from './update-shape';

describe('UpdateShape', () => {
  let service: UpdateShape;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateShape);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
