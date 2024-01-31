import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

// Third-party modules
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { ResponsesTableComponent } from './components/responses-table/responses-table.component';
import { ResponsePageComponent } from './components/response-page/response-page.component';
import { AnswersTableComponent } from './components/answers-table/answers-table.component';

const MatModules = [
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
];

@NgModule({
  declarations: [
    AdminHomeComponent,
    ResponsesTableComponent,
    ResponsePageComponent,
    AnswersTableComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MatModules,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
})
export class AdminModule {}
