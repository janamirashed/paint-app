import { TestBed } from '@angular/core/testing';

import { ShapeFactory } from './shape-factory';

describe('ShapeFactory', () => {
  let service: ShapeFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShapeFactory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
