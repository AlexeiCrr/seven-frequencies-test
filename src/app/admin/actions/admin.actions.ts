import { createAction, props } from '@ngrx/store';

import { QuizResponse } from 'src/app/quiz/interfaces/quizResponse';

export const LoadQuizResponsesStartAction = createAction(
  '[Admin] Load quiz responses start'
);
export const LoadQuizResponsesSuccessAction = createAction(
  '[Admin] Load quiz responses success',
  props<{
    quizResponses: QuizResponse[];
  }>()
);
export const LoadQuizResponsesFailureAction = createAction(
  '[Admin] Load quiz responses failure',
  props<{ error: string }>()
);

export const LoadSingleQuizResponseStartAction = createAction(
  '[Admin] Load single quiz response start',
  props<{ id: string }>()
);
export const LoadSingleQuizResponseSuccessAction = createAction(
  '[Admin] Load single quiz response  success',
  props<{
    quizResponse: QuizResponse;
  }>()
);
export const LoadSingleQuizResponseFailureAction = createAction(
  '[Admin] Load single quiz response  failure',
  props<{ error: string }>()
);
