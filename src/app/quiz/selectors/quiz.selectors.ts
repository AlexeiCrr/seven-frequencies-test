import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QuizState } from '../reducers/quiz.reducer';
import { Question } from '../interfaces/question';
import { QuizResponseCreate } from '../interfaces/quizResponse';

export const selectQuizState = createFeatureSelector<QuizState>('quizStore');

export const selectQuestions = createSelector(
  selectQuizState,
  (state: QuizState): Question[] => state.questionsList.questions
);
export const selectQuestionsLoading = createSelector(
  selectQuizState,
  (state: QuizState): boolean => state.questionsList.loading
);
export const selectQuestionsError = createSelector(
  selectQuizState,
  (state: QuizState): string => state.questionsList.error
);

export const selectQuizResponse = createSelector(
  selectQuizState,
  (state: QuizState): QuizResponseCreate | null => state.quizResponse.response
);
export const selectQuizResponseLoading = createSelector(
  selectQuizState,
  (state: QuizState): boolean => state.quizResponse.loading
);
export const selectQuizResponseError = createSelector(
  selectQuizState,
  (state: QuizState): string => state.quizResponse.error
);
