export interface Question {
	id: number;
	description: string;
	frequencyId: string;
}

export interface QuestionData {
	question: Question;
	index: number;
	value: number;
}
