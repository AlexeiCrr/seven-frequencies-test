import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Subscription } from 'rxjs';

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
  public error: string = '';
  public isSignedIn: boolean;
  public authorizedUser: UserIdentity;

  private readonly subscriptions = new Subscription();

  public constructor(
    private readonly adminStore: Store<AdminState>,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService
  ) {}

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

  private loadQuizResponses(): void {
    this.subscriptions.add(
      this.adminStore
        .pipe(select(selectQuizResponses))
        .subscribe((quizResponses) => {
          this.quizResponses = [...quizResponses];
          this.cdr.markForCheck();
        })
    );
    this.subscriptions.add(
      this.adminStore
        .pipe(select(selectQuizResponsesLoading))
        .subscribe((isLoading) => {
          this.isLoading = isLoading;
          this.cdr.markForCheck();
        })
    );
    this.subscriptions.add(
      this.adminStore
        .pipe(select(selectQuizResponsesError))
        .subscribe((error) => {
          this.error = error;
          this.cdr.markForCheck();
        })
    );
  }

  public onSignOut(): void {
    this.authService.signOut();
  }
}
