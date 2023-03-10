// Angular
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { isLoggedIn } from '../selectors/auth.selector';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(isLoggedIn),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }
}
