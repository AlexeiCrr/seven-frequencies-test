import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersTableComponent } from './answers-table.component';

describe('AnswersTableComponent', () => {
  let component: AnswersTableComponent;
  let fixture: ComponentFixture<AnswersTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnswersTableComponent]
    });
    fixture = TestBed.createComponent(AnswersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
