import { TestBed } from '@angular/core/testing';

import { DrawService} from './draw';

describe('Draw', () => {
  let service: DrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
