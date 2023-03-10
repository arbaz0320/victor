import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  base_url = environment.baseUrl;

  constructor(private http: HttpClient) {}

  login(dados: any): Promise<any> {
    return this.http.post(`${this.base_url}/auth`, dados).toPromise();
  }

  resetPassword(dados: any): Promise<any> {
    return this.http.post(`${this.base_url}/public-routes/reset-password`, dados).toPromise();
  }

  getUserByToken(queryParams: any = {}): Promise<any> {
    return this.http
      .get(`${this.base_url}/auth/me`, { params: queryParams })
      .toPromise();
  }
}
