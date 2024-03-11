import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { CreateQuizResponseStartAction } from '../../actions/quiz.actions';
import { Answer } from '../../interfaces/answer';
import { GreetingFormData } from '../../interfaces/greeting';
import { NextQuestionData, Question } from '../../interfaces/question';
import { QuizResponseCreate } from '../../interfaces/quizResponse';
import { QuizState } from '../../reducers/quiz.reducer';
import {
  selectQuestions,
  selectQuestionsError,
  selectQuestionsLoading,
  selectQuizResponse,
  selectQuizResponseError,
  selectQuizResponseLoading,
} from '../../selectors/quiz.selectors';

@Component({
  selector: 'app-quiz-home',
  templateUrl: './quiz-home.component.html',
  styleUrls: ['./quiz-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('moveAndDisappear', [
      transition(':leave', [
        style({
          position: 'absolute',
          // width: '600px',
          // top: 'calc(50% - 147px)',
          // left: 'calc(50% - 315px)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
        }),
        animate(
          '300ms',
          style({
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class QuizHomeComponent implements OnInit {
  public greetingFormData: GreetingFormData;
  public questions: Question[] = [];
  public questionIndex: number = 0;
  public progressValue: number = 0;
  public answers: Answer[] = [];
  public quizResponse: QuizResponseCreate | null = null;
  public showForm: boolean = false;
  public isStarted: boolean = false;
  public isFinished: boolean = false;
  public isLoading: boolean = false;

  public error: string = '';

  private readonly subscriptions = new Subscription();

  public constructor(
    private readonly quizStore: Store<QuizState>,
    private readonly cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.loadQuestions();
    this.loadQuizResponse();
  }

  private loadQuestions(): void {
    this.subscriptions.add(
      this.quizStore.pipe(select(selectQuestions)).subscribe((questions) => {
        this.questions = [...questions];
        this.cdr.markForCheck();
      })
    );
    this.subscriptions.add(
      this.quizStore
        .pipe(select(selectQuestionsLoading))
        .subscribe((isLoading) => {
          this.isLoading = isLoading;
          this.cdr.markForCheck();
        })
    );
    this.subscriptions.add(
      this.quizStore.pipe(select(selectQuestionsError)).subscribe((error) => {
        this.error = error;
        this.cdr.markForCheck();
      })
    );
  }

  private loadQuizResponse(): void {
    this.subscriptions.add(
      this.quizStore.pipe(select(selectQuizResponse)).subscribe((response) => {
        this.quizResponse = response;
        this.cdr.markForCheck();
      })
    );
    this.subscriptions.add(
      this.quizStore
        .pipe(select(selectQuizResponseLoading))
        .subscribe((isLoading) => {
          this.isLoading = isLoading;
          this.cdr.markForCheck();
        })
    );
    this.subscriptions.add(
      this.quizStore
        .pipe(select(selectQuizResponseError))
        .subscribe((error) => {
          this.error = error;
          this.cdr.markForCheck();
        })
    );
  }

  public onNextClick(data: NextQuestionData): void {
    this.questionIndex = data.index + 1;
    this.progressValue = (100 / this.questions.length) * this.questionIndex;
    this.isFinished = this.questionIndex === this.questions.length;

    this.answers.push({
      questionId: data.question.id,
      frequencyId: data.question.frequencyId,
      value: data.value,
    });

    if (this.isFinished) {
      this.quizStore.dispatch(
        CreateQuizResponseStartAction({
          userData: this.greetingFormData,
          answers: this.answers,
        })
      );
    }
  }

  public onShowForm(): void {
    this.showForm = true;
  }

  public onStartClick(greetingFormData: GreetingFormData): void {
    this.greetingFormData = { ...greetingFormData };
    this.isStarted = true;
  }
}
