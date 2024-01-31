import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState } from '../reducers/admin.reducers';
import { QuizResponse } from 'src/app/quiz/interfaces/quizResponse';

export const selectAdminState = createFeatureSelector<AdminState>('adminStore');

export const selectQuizResponses = createSelector(
  selectAdminState,
  (state: AdminState): QuizResponse[] => state.quizResponsesList.quizResponses
);
export const selectQuizResponsesLoading = createSelector(
  selectAdminState,
  (state: AdminState): boolean => state.quizResponsesList.loading
);
export const selectQuizResponsesError = createSelector(
  selectAdminState,
  (state: AdminState): string => state.quizResponsesList.error
);

export const selectSingleQuizResponse = createSelector(
  selectAdminState,
  (state: AdminState): QuizResponse | null =>
    state.singleQuizResponse.quizResponse
);
export const selectSingleQuizResponseLoading = createSelector(
  selectAdminState,
  (state: AdminState): boolean => state.singleQuizResponse.loading
);
export const selectSingleQuizResponseError = createSelector(
  selectAdminState,
  (state: AdminState): string => state.singleQuizResponse.error
);
