import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../core/reducers';
import { Logout } from '../core/actions/auth.action';

@Injectable({
  providedIn: 'root',
})
export class InterceptService {
  private returnUrl: string = '';

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private message: MessageService,
    private redirect: Router,
    private modalCtrl: NgbModal
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.returnUrl = event.url;
      }
    });
  }

  // intercept request and add token
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // tslint:disable-next-line:no-debugger
    // modify request
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem(
          environment.authTokenKey
        )}`,
      },
    });
    // console.log('----request----');
    // console.log(request);
    // console.log('--- end of request---');

    return next.handle(request).pipe(
      tap(
        (event) => {
          if (event instanceof HttpResponse) {
            // console.log('event intercept', event);
            if (event.body.message && event.status == 200) {
              if (event.body.error && event.body.error == false) {
                this.message.toastSuccess(event.body.message, '');
              } else if (event.body.error == true) {
                this.message.toastError(
                  event.body.message,
                  'Falha na requisição'
                );
              }
            }

            if (event.body.message && event.status == 201) {
              this.message.toastSuccess(event.body.message, '');
            }
          }
        },
        (error) => {
          if (error.status == 0) {
            this.message.alertNet();
          } else if (error.status == 401 || error.status == 403) {
            this.message.toastError(
              'Faça login novamente para continuar',
              'Sessão expirada'
            );

            this.modalCtrl.dismissAll();

            this.store.dispatch(new Logout());
            // localStorage.removeItem(environment.authTokenKey);
            // this.redirect.navigate(['/auth']);
          } else {
            let message = '';
            if (Array.isArray(error.error.erros)) {
              for (let err of error.error.erros) {
                message += `${err} \n`;
              }
            } else {
              message = error.error.message;
            }

            this.message.toastError(message, 'Falha na requisição');
          }

          // console.log('error intercept', error);
        }
      )
    );
  }
}
