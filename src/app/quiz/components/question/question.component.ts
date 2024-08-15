import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Question, QuestionData } from 'src/app/quiz/interfaces/question';

@Component({
	selector: 'app-question',
	templateUrl: './question.component.html',
	styleUrls: ['./question.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent {
	@Input() public question: Question = {
		description: '',
		id: 0,
		frequencyId: '',
	};
	@Input() public questionIndex: number;
	@Input() public totalQuestions: number;
	@Output() public nextClick: EventEmitter<QuestionData> = new EventEmitter();
	@Output() public prevClick: EventEmitter<QuestionData> = new EventEmitter();

	public form: FormGroup;
	public numbers = [1, 2, 3, 4, 5];

	public constructor(private formBuilder: FormBuilder) {
		this.form = this.formBuilder.group({
			selectedOption: '',
		});
		this.questionIndex = 0;
		this.totalQuestions = 0;
	}

	public onNextClick(): void {
		this.nextClick.emit({
			question: this.question,
			index: this.questionIndex,
			value: Number(this.form.value.selectedOption),
		});
	}

	public onPrevClick(): void {
		this.prevClick.emit({
			question: this.question,
			index: this.questionIndex,
			value: Number(this.form.value.selectedOption),
		});
	}
}
