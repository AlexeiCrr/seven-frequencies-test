import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import jwt_decode from 'jwt-decode';
import { CognitoAuth, CognitoAuthSession } from 'amazon-cognito-auth-js';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

import { environment } from 'src/environments/environment';
import { UserIdentity } from '../util/auth';
import { TokenPayload, User } from '../interfaces/auth';
import { WindowRefService } from './window-ref.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$ = new ReplaySubject<UserIdentity>(1);
  public authorizedUser$ = new ReplaySubject<User>(1);
  public awsCredentials;
  public cognitoIdentityClient: CognitoIdentityClient;
  public cognitoIdentityProvider: CognitoIdentityProvider;

  public isTokenRefreshing: boolean;
  private readonly auth: CognitoAuth;

  public constructor(
    private readonly router: Router,
    private readonly windowService: WindowRefService,
    private readonly http: HttpClient
  ) {
    this.awsCredentials = {
      accessKeyId: undefined,
      data: null,
      expireTime: null,
      expired: true,
    };
    this.auth = new CognitoAuth({
      ClientId: environment.cognito.clientId,
      UserPoolId: environment.cognito.userPoolId,
      AppWebDomain: environment.cognito.appWebDomain,
      TokenScopesArray: environment.cognito.tokenScopes,
      RedirectUriSignIn: environment.cognito.redirectUriSignIn,
      RedirectUriSignOut: environment.cognito.redirectUriSignOut,
      IdentityProvider: environment.cognito.identityProvider,
    });
    this.auth.useCodeGrantFlow();
    this.auth.userhandler = {
      onSuccess: this.onSignIn.bind(this),
      onFailure: this.onSignInError.bind(this),
    };
    this.refreshAuthState();
  }

  private createUserIdentity(
    idTokenPayload: object,
    idTokenJwtToken: string
  ): UserIdentity {
    return new UserIdentity(
      idTokenPayload['cognito:username'],
      idTokenPayload['email'],
      idTokenPayload['name'],
      idTokenJwtToken,
      idTokenPayload['sub']
    );
  }

  public signIn(): CognitoAuthSession {
    return this.auth.getSession();
  }

  public signOut(): void {
    this.auth.signOut();
  }

  public isSignedIn(): boolean {
    return !!this.getIdTokenPayload();
  }

  private onSignIn(): void {
    if (this.windowService.nativeWindow.location.pathname === '/admin') {
      this.router.navigate(['/admin'], { queryParams: {} });
    }
    this.refreshAuthState();
  }

  private onSignInError(): void {
    this.signOut();
  }

  private refreshAuthState(): void {
    if (this.isSignedIn()) {
      this.setUserData();
    } else {
      this.login();
    }
  }

  private setUserData(): void {
    const idTokenPayload = this.getIdTokenPayload();
    const idToken = this.getIdToken();
    this.setUser(this.createUserIdentity(idTokenPayload, idToken));
  }

  public refreshToken(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.auth.refreshSession(refreshToken);
    }
  }

  public login(): void {
    this.setUser(null);
    this.auth.parseCognitoWebResponse(
      this.windowService.nativeWindow.location.href
    );
  }

  private setUser(userIdentity: UserIdentity): void {
    if (userIdentity) {
      this.user$.next(userIdentity);
    } else {
      this.user$.next(null);
      this.awsCredentials = null;
    }
  }

  private getIdTokenPayload(): TokenPayload {
    const idToken = this.getIdToken();
    if (idToken) {
      return jwt_decode(idToken);
    }
    return null;
  }

  public getIdToken(): string {
    const session: CognitoAuthSession = this.auth.getSignInUserSession();
    return session && session.idToken ? session.idToken.jwtToken : null;
  }

  private getRefreshToken(): string {
    const session: CognitoAuthSession = this.auth.getSignInUserSession();
    return session && session.refreshToken
      ? session.refreshToken.refreshToken
      : null;
  }

  public isTokenAlive(token: string): boolean {
    if (token) {
      const tokenPayload = jwt_decode(token) as any;
      const now = Math.floor(new Date().getTime() / 1000);
      if (tokenPayload && tokenPayload.exp) {
        return tokenPayload.exp > now;
      }
    }
    return false;
  }

  public refreshToken$(): Observable<UserIdentity> {
    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.refreshToken();
    }
    return this.user$.pipe(
      filter((userData: UserIdentity) => this.isTokenAlive(userData.jwtToken))
    );
  }
}
