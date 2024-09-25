import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-edit-user-dialog',
	templateUrl: './edit-user-dialog.component.html',
	styleUrls: ['./edit-user-dialog.component.scss'],
})
export class EditUserDialogComponent {
	editForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<EditUserDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.editForm = this.fb.group({
			firstName: [data.firstName, Validators.required],
			lastName: [data.lastName, Validators.required],
			email: [data.email, [Validators.required, Validators.email]],
		});
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		if (this.editForm.valid) {
			this.dialogRef.close(this.editForm.value);
		}
	}
}
