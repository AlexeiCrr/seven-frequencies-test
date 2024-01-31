import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { catchError, filter, map, of, switchMap } from 'rxjs';

import {
  LoadQuizResponsesFailureAction,
  LoadQuizResponsesStartAction,
  LoadQuizResponsesSuccessAction,
  LoadSingleQuizResponseStartAction,
  LoadSingleQuizResponseSuccessAction,
} from '../actions/admin.actions';
import { AdminService } from '../services/admin.service';
import { QuizResponse } from 'src/app/quiz/interfaces/quizResponse';
import { Router } from '@angular/router';

@Injectable()
export class AdminEffects {
  public QuizResponsesNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter(
        (routerAction: RouterNavigatedAction) =>
          routerAction.payload.routerState.url === '/admin'
      ),
      map(() => LoadQuizResponsesStartAction()),
      catchError((error) => of(error))
    )
  );

  public SingleQuizResponseNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter((routerAction: RouterNavigatedAction) =>
        routerAction.payload.routerState.url.startsWith('/response')
      ),
      map((data) =>
        LoadSingleQuizResponseStartAction({
          id: this.router.parseUrl(data.payload.event.url).queryParams['id'],
        })
      ),
      catchError((error) => of(error))
    )
  );

  public loadQuizResponses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadQuizResponsesStartAction),
      switchMap(() =>
        this.adminService.getQuizResponses().pipe(
          map((quizResponses: QuizResponse[]) =>
            LoadQuizResponsesSuccessAction({ quizResponses })
          ),
          catchError((error) =>
            of(LoadQuizResponsesFailureAction({ error: error.message }))
          )
        )
      )
    )
  );

  public loadSingleQuizResponse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadSingleQuizResponseStartAction),
      switchMap(({ id }) =>
        this.adminService.getSingleResponse(id).pipe(
          map((quizResponse: QuizResponse) =>
            LoadSingleQuizResponseSuccessAction({ quizResponse })
          ),
          catchError((error) =>
            of(LoadQuizResponsesFailureAction({ error: error.message }))
          )
        )
      )
    )
  );

  public constructor(
    private readonly actions$: Actions,
    private readonly adminService: AdminService,
    private readonly router: Router
  ) {}
}
