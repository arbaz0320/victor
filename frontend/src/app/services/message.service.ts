import { Injectable } from '@angular/core';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { select, Store } from '@ngrx/store';
import { AppState } from '../core/reducers';
import { currentUser } from '../core/selectors/auth.selector';
import { skipWhile, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public swal = Swal;

  constructor(
    public toast: ToastrService,
    private store: Store<AppState>,
    private http: HttpClient
  ) {}

  async getCurrentUser() {
    return await this.store
      .pipe(
        select(currentUser),
        skipWhile((user) => !user),
        take(1)
      )
      .toPromise();
  }

  alertErro(msg = '', titulo = 'Ops!') {
    Swal.fire({
      icon: 'error',
      title: titulo,
      html: msg,
    });
  }
  alertNet() {
    Swal.fire({
      icon: 'error',
      title: 'Falha na conexão',
      html: 'Parece que você está sem internet, verifique a conexão!',
      allowOutsideClick: false,
    }).then((resp) => {
      if (resp.value) {
        location.reload();
      }
    });
  }

  async alertConfirm(msg: string, title = '', options: any = {}) {
    return await Swal.fire({
      title: title,
      icon: 'question',
      html: msg,
      allowOutsideClick: false,
      confirmButtonColor: '#2a66a3',
      showCancelButton: options.showCancelButton ?? true,
      cancelButtonText: options.cancelButton ?? 'Voltar',
      confirmButtonText: options.confirmButton ?? 'Confirmar',
    });
  }

  public toastError(msg = '', title = '') {
    this.toast.error(msg, title);
  }
  public toastSuccess(msg = '', title = '') {
    this.toast.success(msg, title);
  }

  listingMessages(queryParams: any = {}): Promise<any> {
    return this.http
      .get(`${environment.baseUrl}/message`, {
        params: queryParams,
      })
      .toPromise();
  }
  createMessage(data: any): Promise<any> {
    return this.http.post(`${environment.baseUrl}/message`, data).toPromise();
  }
  showMessage(id: any): Promise<any> {
    return this.http.get(`${environment.baseUrl}/message/${id}`).toPromise();
  }
  updateMessage(data: any, id: any): Promise<any> {
    return this.http
      .put(`${environment.baseUrl}/message/${id}`, data)
      .toPromise();
  }
}
