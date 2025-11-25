import { TestBed } from '@angular/core/testing';

import { CanvasStates } from './canvas-states';

describe('CanvasStates', () => {
  let service: CanvasStates;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasStates);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
