import { createReducer, on } from '@ngrx/store';

import { QuizResponse } from 'src/app/quiz/interfaces/quizResponse';
import * as AdminActions from '../actions/admin.actions';

export interface AdminState {
	quizResponsesList: {
		quizResponses: QuizResponse[];
		loading: boolean;
		error: string;
	};
	singleQuizResponse: {
		quizResponse: QuizResponse | null;
		loading: boolean;
		error: string;
	};
	modifyResponseStatus: {
		loading: boolean;
		error: string;
		success: boolean;
	};
}

export const initialQuizState: AdminState = {
	quizResponsesList: {
		quizResponses: [],
		loading: false,
		error: '',
	},
	singleQuizResponse: {
		quizResponse: null,
		loading: false,
		error: '',
	},
	modifyResponseStatus: {
		loading: false,
		error: '',
		success: false,
	},
};

export const adminReducer = createReducer(
	initialQuizState,
	// Load quiz responses
	on(AdminActions.LoadQuizResponsesStartAction, (state) => ({
		...state,
		quizResponsesList: {
			...state.quizResponsesList,
			loading: true,
			error: '',
		},
	})),
	on(AdminActions.LoadQuizResponsesSuccessAction, (state, { quizResponses }) => ({
		...state,
		quizResponsesList: {
			...state.quizResponsesList,
			quizResponses,
			loading: false,
			error: '',
		},
	})),
	on(AdminActions.LoadQuizResponsesFailureAction, (state, { error }) => ({
		...state,
		quizResponsesList: {
			...state.quizResponsesList,
			loading: false,
			error,
		},
	})),
	// Load single quiz response
	on(AdminActions.LoadSingleQuizResponseStartAction, (state) => ({
		...state,
		singleQuizResponse: {
			...state.singleQuizResponse,
			loading: true,
			error: '',
		},
	})),
	on(AdminActions.LoadSingleQuizResponseSuccessAction, (state, { quizResponse }) => ({
		...state,
		singleQuizResponse: {
			...state.singleQuizResponse,
			quizResponse,
			loading: false,
			error: '',
		},
	})),
	on(AdminActions.LoadSingleQuizResponseFailureAction, (state, { error }) => ({
		...state,
		singleQuizResponse: {
			...state.singleQuizResponse,
			loading: false,
			error,
		},
	})),

	on(AdminActions.ResendResponseStartAction, (state) => ({
		...state,
		singleQuizResponse: {
			...state.singleQuizResponse,
			loading: true,
			error: '',
		},
	})),
	on(AdminActions.ResendResponseSuccessAction, (state) => ({
		...state,
		singleQuizResponse: {
			...state.singleQuizResponse,
			loading: false,
			error: '',
		},
	})),
	on(AdminActions.ModifyResponseStartAction, (state) => ({
		...state,
		modifyResponseStatus: {
			loading: true,
			error: '',
			success: false,
		},
	})),

	on(AdminActions.ModifyResponseSuccessAction, (state, { modifiedResponse }) => ({
		...state,
		singleQuizResponse: {
			...state.singleQuizResponse,
			quizResponse: {
				...state.singleQuizResponse.quizResponse,
				...modifiedResponse,
			},
		},
		modifyResponseStatus: {
			loading: false,
			error: '',
			success: true,
		},
	})),

	on(AdminActions.ModifyResponseFailureAction, (state, { error }) => ({
		...state,
		modifyResponseStatus: {
			loading: false,
			error,
			success: false,
		},
	}))
);
