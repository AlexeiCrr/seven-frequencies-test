import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizHomeComponent } from './quiz-home.component';

describe('QuizHomeComponent', () => {
  let component: QuizHomeComponent;
  let fixture: ComponentFixture<QuizHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizHomeComponent]
    });
    fixture = TestBed.createComponent(QuizHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
