import { Answer } from './answer';
import { GreetingFormData } from './greeting';

export interface QuizResponseCreate {
	id: string;
	userData: {
		firstName: string;
		lastName: string;
		email: string;
	};
	createdOn: string;
	frequencies: Frequency[];
}

export interface QuizResponse {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	createdOn: string;
	answers: Answer[];
	frequencies: FrequencyMap;
	licenseCode?: string;
	quizStartedAt?: Date;
}

export interface QuizResult {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	createdOn: string;
	answers: Answer[];
	frequencies: Frequency[];
}

export interface FrequencyMap {
	[key: string]: number;
}
export interface Frequency {
	id?: number;
	name: string;
	value: number;
	description: string;
}

export interface CreateQuizResponseParams {
	userData: GreetingFormData;
	answers: Answer[];
}

export interface UserData {
	firstName: string;
	lastName: string;
	email: string;
	responseId?: number;
}
