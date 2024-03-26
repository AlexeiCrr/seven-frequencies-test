import { Component, Input } from '@angular/core';

import { QuizResponse } from 'src/app/quiz/interfaces/quizResponse';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
  @Input() public quizResponse: QuizResponse | null = null;

  public handleJoin() {
    window.open('https://www.erwinmcmanus.com/thearena', '_blank');
  }
}


