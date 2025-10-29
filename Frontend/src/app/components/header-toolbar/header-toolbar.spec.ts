import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderToolbar } from './header-toolbar';

describe('HeaderToolbar', () => {
  let component: HeaderToolbar;
  let fixture: ComponentFixture<HeaderToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
