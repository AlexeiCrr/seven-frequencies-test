import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-report-stats-modal',
	templateUrl: './report-stats-modal.component.html',
	styleUrls: ['./report-stats-modal.component.scss'],
})
export class ReportStatsModalComponent {
	constructor(
		public dialogRef: MatDialogRef<ReportStatsModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	onClose(): void {
		this.dialogRef.close();
	}
}
