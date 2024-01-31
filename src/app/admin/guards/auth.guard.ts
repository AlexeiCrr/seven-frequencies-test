import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { WindowRefService } from '../services/window-ref.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly authService: AuthService,
    private readonly windowService?: WindowRefService
  ) {}

  public canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map((user) => {
        if (user) {
          return true;
        } else if (
          this.windowService.nativeWindow.location.href.includes('code')
        ) {
          return true;
        }
        this.authService.signIn();
        return false;
      })
    );
  }
}
