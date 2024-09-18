import { ChangeDetectorRef, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import html2pdf from 'html2pdf.js';
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
	@ViewChild('pdfContent', { static: true }) pdfContent: TemplateRef<any>;
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
				description:
					'When you communicate with this frequency, you transmit courage and awaken calling in others. Challengers are persuasive, dynamic, and unafraid of confrontation to achieve results.',
				name: 'Challenger',
				value: 42,
			},
			{
				id: 3,
				description:
					'When you communicate with this frequency, you transmit trust and provide direction to others. Commanders are authoritative, clear, and direct others with confidence to execute goals.',
				name: 'Commander',
				value: 25,
			},
			{
				id: 4,
				description:
					'When you communicate with this frequency, you transmit energy and infuse self-belief in others. Motivators are positive, encouraging, and enthusiastic supporters of the dreams and goals of others.',
				name: 'Motivator',
				value: 45,
			},
		],
	};

	public ngOnInit(): void {
		// this.getFrequencyData();
	}

	ngAfterViewInit() {
		this.cdr.detectChanges(); // Force view refresh after template is loaded
		if (this.pdfContent) {
			console.log('pdfContent template found', this.pdfContent);
		} else {
			console.log('pdfContent template not found');
		}
	}

	// getFrequencyData() {
	// 	const sortedFrequencies =
	// 		this.quizResponse?.frequencies.sort((a, b) => b.value - a.value) || [];

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

	generatePDF(): void {
		const images = Array.from(document.querySelectorAll('.frequency-response-img'));
		console.log('images', images);
		this.createPDF();
	}

	private createPDF(): void {
		const element = document.getElementById('pdf-content');
		if (element) {
			const opt = {
				margin: 10,
				filename: 'seven-frequencies-result.pdf',
				image: { type: 'jpg', quality: 0.98 },
				html2canvas: { scale: 2, useCORS: true },
				jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
			};
			html2pdf().from(element).set(opt).save();
		}
	}

	//! TODO Mock frequency data
	getFrequencyData() {
		const sortedFrequencies = this.mockResults?.frequencies.sort((a, b) => b.value - a.value) || [];

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
}
