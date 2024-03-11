import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material modules
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

// Third-party modules
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

import { GreetingComponent } from './components/greeting/greeting.component';
import { QuestionComponent } from './components/question/question.component';
import { QuizHomeComponent } from './components/quiz-home/quiz-home.component';
import { ResultsComponent } from './components/results/results.component';

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
