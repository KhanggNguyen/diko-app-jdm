import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordListComponentComponent } from './word-list-component.component';

describe('WordListComponentComponent', () => {
  let component: WordListComponentComponent;
  let fixture: ComponentFixture<WordListComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordListComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
