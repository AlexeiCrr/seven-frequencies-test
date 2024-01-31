import { createAction, props } from '@ngrx/store';

import { Question } from '../interfaces/question';
import {
  CreateQuizResponseParams,
  QuizResponseCreate,
} from '../interfaces/quizResponse';

export const LoadQuestionsStartAction = createAction(
  '[Quiz] Load questions start'
);
export const LoadQuestionsSuccessAction = createAction(
  '[Quiz] Load questions success',
  props<{
    questions: Question[];
  }>()
);
export const LoadQuestionsFailureAction = createAction(
  '[Quiz] Load questions failure',
  props<{ error: string }>()
);

export const CreateQuizResponseStartAction = createAction(
  '[Quiz] Create quiz response start',
  props<CreateQuizResponseParams>()
);
export const CreateQuizResponseSuccessAction = createAction(
  '[Quiz] Create quiz response success',
  props<{ quizResponse: QuizResponseCreate }>()
);
export const CreateQuizResponseFailureAction = createAction(
  '[Quiz] Create quiz response failure',
  props<{ error: string }>()
);
