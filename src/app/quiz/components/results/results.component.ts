import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FrequencyInfoService } from 'src/app/admin/services/frequency.service';

import { Frequency, QuizResponse } from 'src/app/quiz/interfaces/quizResponse';

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
	@Input() public quizResponse: QuizResponse | null = null;
	public frequencyInfo: Record<string, Frequency> = {};
	private readonly subscriptions = new Subscription();

	public constructor(
		private readonly cdr: ChangeDetectorRef,
		private frequencyInfoService: FrequencyInfoService
	) {}

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

	public ngOnInit(): void {
		this.getFrequencyData();
	}

	getFrequencyData() {
		const sortedFrequencies =
			this.quizResponse?.frequencies.sort((a, b) => b.value - a.value) || [];

		if (sortedFrequencies.length) {
			this.subscriptions.add(
				this.frequencyInfoService.getFrequencyInfo().subscribe({
					next: (data) => {
						const mainFrequency = sortedFrequencies[0].name.toLowerCase();
						this.frequencyInfo = data[mainFrequency];
						console.log('FREQUENCY INFO LOADED:', data[mainFrequency]);
						this.cdr.markForCheck();
					},
					error: (error) => {
						console.error('Error loading frequency info:', error);
						this.cdr.markForCheck();
					},
				})
			);
		}
	}

	// Mock frequency data
	// getFrequencyData() {
	// 	const sortedFrequencies = this.mockResults?.frequencies.sort((a, b) => b.value - a.value) || [];

	// 	console.log(sortedFrequencies);

	// 	if (sortedFrequencies.length) {
	// 		this.subscriptions.add(
	// 			this.frequencyInfoService.getFrequencyInfo().subscribe({
	// 				next: (data) => {
	// 					const mainFrequency = sortedFrequencies[0].name.toLowerCase();
	// 					this.frequencyInfo = data[mainFrequency];
	// 					console.log('FREQUENCY INFO LOADED:', data[mainFrequency]);
	// 					this.cdr.markForCheck();
	// 				},
	// 				error: (error) => {
	// 					console.error('Error loading frequency info:', error);
	// 					this.cdr.markForCheck();
	// 				},
	// 			})
	// 		);
	// 	}
	// }

	public handleJoin() {
		window.open('https://www.erwinmcmanus.com/thearena', '_blank');
	}
}
