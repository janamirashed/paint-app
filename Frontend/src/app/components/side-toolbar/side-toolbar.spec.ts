import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideToolbar } from './side-toolbar';

describe('SideToolbar', () => {
  let component: SideToolbar;
  let fixture: ComponentFixture<SideToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
