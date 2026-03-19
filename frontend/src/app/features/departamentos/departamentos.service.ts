import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../core/config/api.config';
import { ApiClientService } from '../../core/http/api-client.service';
import { PageResponse } from '../../core/http/api.models';
import { DepartamentoRequest, DepartamentoResponse } from './departamentos.models';

@Injectable({ providedIn: 'root' })
export class DepartamentosService {
  constructor(private readonly apiClient: ApiClientService) {}

  getPage(page: number, size: number): Observable<PageResponse<DepartamentoResponse>> {
    return this.apiClient.get<PageResponse<DepartamentoResponse>>(API_CONFIG.departamentosPath, {
      page,
      size
    });
  }

  getByClave(clave: string): Observable<DepartamentoResponse> {
    return this.apiClient.get<DepartamentoResponse>(`${API_CONFIG.departamentosPath}/${clave}`);
  }

  create(payload: DepartamentoRequest): Observable<DepartamentoResponse> {
    return this.apiClient.post<DepartamentoResponse>(API_CONFIG.departamentosPath, payload);
  }

  update(clave: string, payload: DepartamentoRequest): Observable<DepartamentoResponse> {
    return this.apiClient.put<DepartamentoResponse>(`${API_CONFIG.departamentosPath}/${clave}`, payload);
  }

  delete(clave: string): Observable<void> {
    return this.apiClient.delete<void>(`${API_CONFIG.departamentosPath}/${clave}`);
  }
}
