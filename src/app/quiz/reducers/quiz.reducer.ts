import { createReducer, on } from '@ngrx/store';

import { Question } from '../interfaces/question';
import * as QuizActions from '../actions/quiz.actions';
import { QuizResponseCreate } from '../interfaces/quizResponse';

export interface QuizState {
  questionsList: {
    questions: Question[];
    loading: boolean;
    error: string;
  };
  quizResponse: {
    response: QuizResponseCreate | null;
    loading: boolean;
    error: string;
  };
}

export const initialQuizState: QuizState = {
  questionsList: {
    questions: [],
    loading: false,
    error: '',
  },
  quizResponse: {
    response: null,
    loading: false,
    error: '',
  },
};

export const quizReducer = createReducer(
  initialQuizState,
  // Load Questions
  on(QuizActions.LoadQuestionsStartAction, (state) => ({
    ...state,
    questionsList: {
      ...state.questionsList,
      loading: true,
      error: '',
    },
  })),
  on(QuizActions.LoadQuestionsSuccessAction, (state, { questions }) => ({
    ...state,
    questionsList: {
      ...state.questionsList,
      questions,
      loading: false,
      error: '',
    },
  })),
  on(QuizActions.LoadQuestionsFailureAction, (state, { error }) => ({
    ...state,
    questionsList: {
      ...state.questionsList,
      loading: false,
      error,
    },
  })),
  // Create Quiz
  on(QuizActions.CreateQuizResponseStartAction, (state) => ({
    ...state,
    quizResponse: {
      ...state.quizResponse,
      loading: true,
      error: '',
    },
  })),
  on(
    QuizActions.CreateQuizResponseSuccessAction,
    (state, { quizResponse }) => ({
      ...state,
      quizResponse: {
        ...state.quizResponse,
        response: quizResponse,
        loading: false,
        error: '',
      },
    })
  ),
  on(QuizActions.CreateQuizResponseFailureAction, (state, { error }) => ({
    ...state,
    quizResponse: {
      ...state.quizResponse,
      loading: false,
      error,
    },
  }))
);
