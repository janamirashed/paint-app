import { TestBed } from '@angular/core/testing';

import { Draw } from './draw';

describe('Draw', () => {
  let service: Draw;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Draw);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
