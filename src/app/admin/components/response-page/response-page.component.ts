import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import html2pdf from 'html2pdf.js';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription, takeUntil } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModifyResponseStartAction } from 'src/app/admin/actions/admin.actions';
import { EditUserDialogComponent } from 'src/app/admin/components/edit-user-data/edit-user-dialog.component';
import { AdminService } from 'src/app/admin/services/admin.service';
import { ResendResponseService } from 'src/app/admin/services/response.service';
import { QuizResponse } from 'src/app/quiz/interfaces/quizResponse';
import { AdminState } from '../../reducers/admin.reducers';
import {
	selectModifyResponseStatus,
	selectSingleQuizResponse,
	selectSingleQuizResponseError,
	selectSingleQuizResponseLoading,
} from '../../selectors/admin.selectors';
import { AuthService } from '../../services/auth.service';
import { UserIdentity } from '../../util/auth';

@Component({
	selector: 'app-response-page',
	templateUrl: './response-page.component.html',
	styleUrls: ['./response-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsePageComponent implements OnInit {
	public quizResponse: QuizResponse | null = null;
	public isLoading: boolean = false;
	public error: string = '';
	public phoneNumberMask = '(000) 000-0000';
	public authorizedUser: UserIdentity;
	public isResending = false;
	public isUpdating = false;
	public changeDataDialogOpen = false;
	private unsubscribe$ = new Subject<void>();
	public responseData: QuizResponse | null = null;

	private readonly subscriptions = new Subscription();

	public constructor(
		private readonly adminStore: Store<AdminState>,
		private readonly cdr: ChangeDetectorRef,
		private readonly router: Router,
		private readonly authService: AuthService,
		private readonly adminService: AdminService,
		private resendResponseService: ResendResponseService,
		private snackBar: MatSnackBar,
		private dialog: MatDialog
	) {}

	public ngOnInit(): void {
		this.loadQuizResponses();
		this.loadAuthorizedUser();
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	private loadAuthorizedUser(): void {
		this.authService.user$.subscribe((user) => {
			this.authorizedUser = user;
		});
	}

	private loadQuizResponses(): void {
		this.subscriptions.add(
			this.adminStore.pipe(select(selectSingleQuizResponse)).subscribe((quizResponse) => {
				this.quizResponse = quizResponse;

				if (this.quizResponse?.frequencies) {
					const sortedFrequencies = Object.entries(quizResponse.frequencies).sort(
						(a, b) => b[1] - a[1]
					);
					const top3Frequencies = sortedFrequencies.slice(0, 3).reverse();
					const frequencies = top3Frequencies.map((item) => {
						return { name: item[0], value: item[1] };
					});

					this.responseData = { ...this.quizResponse, frequencies: frequencies as any };
				}

				this.cdr.markForCheck();
			})
		);
		this.subscriptions.add(
			this.adminStore.pipe(select(selectSingleQuizResponseLoading)).subscribe((isLoading) => {
				this.isLoading = isLoading;
				this.cdr.markForCheck();
			})
		);
		this.subscriptions.add(
			this.adminStore.pipe(select(selectSingleQuizResponseError)).subscribe((error) => {
				this.error = error;
				this.cdr.markForCheck();
			})
		);
	}

	public handleResendResults(): void {
		this.isResending = true;

		this.resendResponseService.resendResponse(this.quizResponse.id).subscribe({
			next: (result) => {
				this.isResending = false;
				this.cdr.detectChanges(); // Force change detection here
				if (result.success) {
					console.log(result.message);
					this.snackBar.open(result.message, 'Close', {
						duration: 10000,
						panelClass: ['success-snackbar'],
						verticalPosition: 'top',
					});
				} else {
					console.error(result.message);
				}
			},
			error: (error) => {
				console.error('Error resending response:', error);
				this.isResending = false;
				this.cdr.detectChanges(); // Force change detection here as well
			},
		});
	}

	public handleDownloadResults() {}

	private createAndDownloadPDF(): void {
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

	openEditUserDialog(): void {
		const dialogRef = this.dialog.open(EditUserDialogComponent, {
			width: '400px',
			data: {
				firstName: this.quizResponse?.firstName,
				lastName: this.quizResponse?.lastName,
				email: this.quizResponse?.email,
				responseId: this.quizResponse?.id,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			this.isUpdating = true;
			if (result) {
				this.adminStore.dispatch(
					ModifyResponseStartAction({
						data: {
							...result,
							responseId: this.quizResponse?.id,
						},
					})
				);

				this.adminStore
					.pipe(select(selectModifyResponseStatus), takeUntil(this.unsubscribe$))
					.subscribe((status) => {
						if (status.success) {
							this.isUpdating = false;
							this.snackBar.open('Data modified successfully', 'Close', {
								duration: 4000,
								verticalPosition: 'top',
								panelClass: ['success-snackbar'],
							});
						} else if (status.error) {
							this.isUpdating = false;
							this.snackBar.open('Failed to modify response', 'Close', {
								duration: 3000,
								verticalPosition: 'top',
								panelClass: ['error-snackbar'],
							});
						}
						this.quizResponse = {
							...this.quizResponse,
							...result,
						};
						this.cdr.markForCheck();
					});
			}
		});
	}

	public handleOpenDialog(): void {
		this.changeDataDialogOpen = true;
	}

	public onBackClick(): void {
		this.router.navigate(['admin']);
	}

	public onSignOut(): void {
		this.authService.signOut();
	}
}
