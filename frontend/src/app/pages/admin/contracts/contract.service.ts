import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  constructor(private http: HttpClient) {}

  getBaseUrl() {
    return `${environment.baseUrl}`;
  }

  listingTypes(queryParams: any = {}): Promise<any> {
    return this.http
      .get(`${this.getBaseUrl()}/contract-type`, { params: queryParams })
      .toPromise();
  }

  listingFields(queryParams: any = {}): Promise<any> {
    return this.http
      .get(`${this.getBaseUrl()}/fields-block`, { params: queryParams })
      .toPromise();
  }

  deleteField(id: any): Promise<any> {
    return this.http
      .delete(`${this.getBaseUrl()}/fields-block/${id}`)
      .toPromise();
  }
  deleteConditional(id: any): Promise<any> {
    return this.http
      .delete(`${this.getBaseUrl()}/contract-conditional/${id}`)
      .toPromise();
  }
}
