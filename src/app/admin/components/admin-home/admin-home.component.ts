import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { catchError, Subscription, tap, throwError } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/admin/services/admin.service';
import { QuizResponse } from 'src/app/quiz/interfaces/quizResponse';
import { AdminState } from '../../reducers/admin.reducers';
import {
	selectQuizResponses,
	selectQuizResponsesError,
	selectQuizResponsesLoading,
} from '../../selectors/admin.selectors';
import { AuthService } from '../../services/auth.service';
import { UserIdentity } from '../../util/auth';

@Component({
	selector: 'app-admin-home',
	templateUrl: './admin-home.component.html',
	styleUrls: ['./admin-home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHomeComponent implements OnInit {
	public quizResponses: QuizResponse[] = [];
	public isLoading: boolean = false;
	public isLoadingCodes: boolean = false;
	public error: string = '';
	public isSignedIn: boolean;
	public authorizedUser: UserIdentity;
	isModalOpen = false;
	generateCodesForm: FormGroup;

	private readonly subscriptions = new Subscription();

	public constructor(
		private readonly adminStore: Store<AdminState>,
		private readonly cdr: ChangeDetectorRef,
		private readonly adminService: AdminService,
		private readonly authService: AuthService,
		private snackBar: MatSnackBar,
		private fb: FormBuilder
	) {
		this.generateCodesForm = this.fb.group({
			amount: ['', [Validators.required, Validators.min(1)]],
		});
	}

	openGenerateCodesModal() {
		this.isModalOpen = true;
	}

	public ngOnInit(): void {
		this.loadQuizResponses();
		this.loadAuthorizedUser();
	}

	private loadAuthorizedUser(): void {
		this.authService.user$.subscribe((user) => {
			this.authorizedUser = user;
			this.isSignedIn = !!user;
		});
	}

	generateUniqueFilename(amount: number, extension) {
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		return `${amount}_license_codes_${timestamp}${extension}`;
	}

	handleGenerateCodes() {
		if (this.generateCodesForm.valid) {
			const amount = this.generateCodesForm.value.amount;
			this.isLoadingCodes = true;

			this.adminService
				.addLicenseCodes(amount)
				.pipe(
					tap((blob: Blob) => {
						const reader = new FileReader();
						reader.onload = () => {
							const csvString = reader.result as string;
							const properCsvContent = this.parseStringToCsv(csvString);

							const newBlob = new Blob([properCsvContent], { type: 'text/csv;charset=utf-8;' });
							const url = window.URL.createObjectURL(newBlob);
							const a = document.createElement('a');
							a.href = url;
							a.download = this.generateUniqueFilename(amount, '.csv');
							document.body.appendChild(a);
							a.click();
							document.body.removeChild(a);
							window.URL.revokeObjectURL(url);

							this.snackBar.open(`Successfully generated ${amount} license codes`, 'Close', {
								duration: 5000,
								horizontalPosition: 'center',
								verticalPosition: 'top',
								panelClass: ['success-snackbar'],
							});
						};
						reader.readAsText(blob);
					}),
					catchError((error) => {
						this.snackBar.open('Failed to generate license codes. Please try again.', 'Close', {
							duration: 5000,
							horizontalPosition: 'center',
							verticalPosition: 'top',
							panelClass: ['error-snackbar'],
						});
						console.error('Error generating license codes:', error);
						return throwError(() => error);
					})
				)
				.subscribe({
					complete: () => {
						this.isLoadingCodes = false;
						this.closeGenerateCodesModal();
					},
				});
		}
	}

	private parseStringToCsv(codesString: string): string {
		const codes = codesString
			.replace(/^"?code\\r\\n/, '')
			.split(/\\r\\n|\n/)
			.filter(Boolean);

		if (codes[codes.length - 1] === '"') {
			codes.pop();
		}

		const header = 'Code\n';
		const rows = codes.join('\n');

		return header + rows;
	}
	closeGenerateCodesModal() {
		this.isModalOpen = false;
		this.generateCodesForm.reset();
	}

	private loadQuizResponses(): void {
		this.subscriptions.add(
			this.adminStore.pipe(select(selectQuizResponses)).subscribe((quizResponses) => {
				this.quizResponses = [...quizResponses];
				this.cdr.markForCheck();
			})
		);
		this.subscriptions.add(
			this.adminStore.pipe(select(selectQuizResponsesLoading)).subscribe((isLoading) => {
				this.isLoading = isLoading;
				this.cdr.markForCheck();
			})
		);
		this.subscriptions.add(
			this.adminStore.pipe(select(selectQuizResponsesError)).subscribe((error) => {
				this.error = error;
				this.cdr.markForCheck();
			})
		);
	}

	public onSignOut(): void {
		this.authService.signOut();
	}
}
