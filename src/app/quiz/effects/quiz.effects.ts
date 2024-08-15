import { Injectable } from '@angular/core';
import { LicenseService } from './../services/license.service';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { catchError, filter, map, of, switchMap } from 'rxjs';

import { LicenseCheckResponse } from 'src/app/quiz/interfaces/license';
import {
  CheckLicenseCodeFailureAction,
  CheckLicenseCodeStartAction,
  CheckLicenseCodeSuccessAction,
  CreateQuizResponseFailureAction,
  CreateQuizResponseStartAction,
  CreateQuizResponseSuccessAction,
  LoadQuestionsFailureAction,
  LoadQuestionsStartAction,
  LoadQuestionsSuccessAction,
} from '../actions/quiz.actions';
import { Question } from '../interfaces/question';
import {
  CreateQuizResponseParams,
  QuizResponseCreate,
} from '../interfaces/quizResponse';
import { QuestionsService } from '../services/questions.service';

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

  public checkLicenseCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckLicenseCodeStartAction),
      switchMap((action) =>
        this.licenseService.checkLicenseCode(action.licenseCode).pipe(
          map((response: LicenseCheckResponse) =>
            CheckLicenseCodeSuccessAction({ isValid: response.isValid })
          ),
          catchError((error) =>
            of(CheckLicenseCodeFailureAction({ error: error.message }))
          )
        )
      )
    )
  );

  public constructor(
    private readonly actions$: Actions,
    private readonly questionsService: QuestionsService,
    private readonly licenseService: LicenseService
  ) {}
}
