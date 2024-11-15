import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

// Third-party modules
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AnswersTableComponent } from './components/answers-table/answers-table.component';
import { ResponsePageComponent } from './components/response-page/response-page.component';
import { ResponsesTableComponent } from './components/responses-table/responses-table.component';

import { MatDialogModule } from '@angular/material/dialog';
import { EditUserDialogComponent } from 'src/app/admin/components/edit-user-data/edit-user-dialog.component';
import { ReportStatsModalComponent } from 'src/app/admin/components/report-stats-modal/report-stats-modal.component';

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
	MatSnackBarModule,
	CommonModule,
	ReactiveFormsModule,
	MatDialogModule,
	MatFormFieldModule,
	MatInputModule,
	MatButtonModule,
];

@NgModule({
	declarations: [
		AdminHomeComponent,
		ResponsesTableComponent,
		ResponsePageComponent,
		AnswersTableComponent,
		EditUserDialogComponent,
		ReportStatsModalComponent,
	],
	imports: [CommonModule, ReactiveFormsModule, ...MatModules, NgxMaskDirective, NgxMaskPipe],
})
export class AdminModule {}
