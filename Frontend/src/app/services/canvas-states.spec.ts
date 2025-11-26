import { TestBed } from '@angular/core/testing';

import { CanvasStatesService } from './canvas-states';

describe('CanvasStates', () => {
  let service: CanvasStatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasStatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
