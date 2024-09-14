import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Subscription } from 'rxjs';

import { Router } from '@angular/router';
import { QuizResponse } from 'src/app/quiz/interfaces/quizResponse';
import { AdminState } from '../../reducers/admin.reducers';
import {
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

	private readonly subscriptions = new Subscription();

	public constructor(
		private readonly adminStore: Store<AdminState>,
		private readonly cdr: ChangeDetectorRef,
		private readonly router: Router,
		private readonly authService: AuthService
	) {}

	public ngOnInit(): void {
		this.loadQuizResponses();
		this.loadAuthorizedUser();
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

	private resendResultsEmail(): void {
		// Implement email resending logic here
	}

	public onBackClick(): void {
		this.router.navigate(['admin']);
	}

	public onSignOut(): void {
		this.authService.signOut();
	}
}
