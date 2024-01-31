import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Material modules
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Third-party modules
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

import { QuestionComponent } from './components/question/question.component';
import { GreetingComponent } from './components/greeting/greeting.component';
import { ResultsComponent } from './components/results/results.component';
import { QuizHomeComponent } from './components/quiz-home/quiz-home.component';

const MatModules = [
  MatRadioModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatProgressBarModule,
  MatInputModule,
  MatButtonToggleModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatCheckboxModule,
];

@NgModule({
  declarations: [
    QuizHomeComponent,
    QuestionComponent,
    GreetingComponent,
    ResultsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...MatModules,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
})
export class QuizModule {}
