import { Component, Input } from '@angular/core';

import { Frequency, QuizResponse } from 'src/app/quiz/interfaces/quizResponse';

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
	@Input() public quizResponse: QuizResponse | null = null;

	mockResults: QuizResponse = {
		firstName: 'Alexei',
		lastName: 'Crudu',
		email: 'crudu-alexei@mail.ru',
		id: 1,
		createdOn: '2022-07-01T14:00:00.000Z',
		answers: [],
		frequencies: [
			{
				id: 2,
				description: 'Challenger description',
				name: 'Challenger',
				value: 42,
			},
			{
				id: 3,
				description: 'Commander description',
				name: 'Commander',
				value: 25,
			},
			{
				id: 4,
				description: 'Motivator description',
				name: 'Motivator',
				value: 45,
			},
		],
	};

	sortedFrequencies(): Frequency[] {
		return this.quizResponse?.frequencies.sort((a, b) => b.value - a.value) || [];
	}

	// sortedFrequencies(): Frequency[] {
	// 	return this.mockResults?.frequencies.sort((a, b) => b.value - a.value) || [];
	// }

	// ngOnInit() {
	// 	console.log('Quiz response:', this.quizResponse);
	// 	debugger;
	// }

	public handleJoin() {
		window.open('https://www.erwinmcmanus.com/thearena', '_blank');
	}
}
