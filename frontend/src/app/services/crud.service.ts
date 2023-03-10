import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class CrudService {
  path = '';
  constructor(private http: HttpClient) {}

  setPath(rota: string) {
    this.path = rota;
  }

  getBaseUrl() {
    return `${environment.baseUrl}/${this.path}`;
  }

  listing(queryParams: any = {}): Promise<any> {
    return this.http
      .get(`${this.getBaseUrl()}`, { params: queryParams })
      .toPromise();
  }
  create(data: any): Promise<any> {
    return this.http.post(`${this.getBaseUrl()}`, data).toPromise();
  }
  show(id: any): Promise<any> {
    return this.http.get(`${this.getBaseUrl()}/${id}`).toPromise();
  }
  update(data: any, id: any): Promise<any> {
    if (data instanceof FormData) {
      return this.http.post(`${this.getBaseUrl()}/${id}`, data).toPromise();
    }
    return this.http.put(`${this.getBaseUrl()}/${id}`, data).toPromise();
  }
  delete(id: any): Promise<any> {
    return this.http.delete(`${this.getBaseUrl()}/${id}`).toPromise();
  }

  customGet(endPoint: string, queryParams: any = {}): Promise<any> {
    return this.http
      .get(`${environment.baseUrl}${endPoint}`, { params: queryParams })
      .toPromise();
  }
  customPost(endPoint: string, data: any = {}): Promise<any> {
    return this.http
      .post(`${environment.baseUrl}${endPoint}`, data)
      .toPromise();
  }
}
