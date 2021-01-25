import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordResultComponent } from './word-result.component';

describe('WordResultComponent', () => {
  let component: WordResultComponent;
  let fixture: ComponentFixture<WordResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
