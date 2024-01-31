import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { catchError, filter, map, of, switchMap } from 'rxjs';

import {
  CreateQuizResponseFailureAction,
  CreateQuizResponseStartAction,
  CreateQuizResponseSuccessAction,
  LoadQuestionsFailureAction,
  LoadQuestionsStartAction,
  LoadQuestionsSuccessAction,
} from '../actions/quiz.actions';
import { QuestionsService } from '../services/questions.service';
import { Question } from '../interfaces/question';
import {
  CreateQuizResponseParams,
  QuizResponseCreate,
} from '../interfaces/quizResponse';

@Injectable()
export class QuizEffects {
  public QuestionsNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter(
        (routerAction: RouterNavigatedAction) =>
          routerAction.payload.routerState.url === '/'
      ),
      map(() => LoadQuestionsStartAction()),
      catchError((error) => of(error))
    )
  );

  public loadQuestions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadQuestionsStartAction),
      switchMap(() =>
        this.questionsService.getQuestions().pipe(
          map((questions: Question[]) =>
            LoadQuestionsSuccessAction({ questions })
          ),
          catchError((error) =>
            of(LoadQuestionsFailureAction({ error: error.message }))
          )
        )
      )
    )
  );

  public createQuizResponse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateQuizResponseStartAction),
      switchMap((createQuizResponseParams: CreateQuizResponseParams) =>
        this.questionsService.createQuizResponse(createQuizResponseParams).pipe(
          map((quizResponse: QuizResponseCreate) =>
            CreateQuizResponseSuccessAction({ quizResponse })
          ),
          catchError((error) =>
            of(CreateQuizResponseFailureAction({ error: error.message }))
          )
        )
      )
    )
  );

  public constructor(
    private readonly actions$: Actions,
    private readonly questionsService: QuestionsService
  ) {}
}
