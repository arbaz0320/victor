// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { currentUser } from '../selectors/auth.selector';
import { map, skipWhile, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MasterGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.store.pipe(
      select(currentUser),
      skipWhile(user => !user),
      map((user) => {
        console.log('user', user);

        if (user != undefined) {

          if (["users", "unidades"].includes(route.routeConfig.path) && (user.tipo == 100)) {
            return true;
          } else if (route.routeConfig.path == "fretes" && (user.tipo == 1 || user.tipo == 10)) {
            return true;
          } else if (route.routeConfig.path == "profile" && user.tipo == 1) {
            return true;
          } else {
            this.router.navigate(['/']);
          }

        } else {

          this.logout();
          return false;

        }
      }),
      take(1)
    );
  }

  logout() {
    this.router.navigate(['/']);
  }
}
