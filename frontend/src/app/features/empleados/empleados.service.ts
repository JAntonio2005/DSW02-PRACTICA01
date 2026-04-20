import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../core/config/api.config';
import { ApiClientService } from '../../core/http/api-client.service';
import { PageResponse } from '../../core/http/api.models';
import { EmpleadoRequest, EmpleadoResponse } from './empleados.models';

@Injectable({ providedIn: 'root' })
export class EmpleadosService {
  constructor(private readonly apiClient: ApiClientService) {}

  getPage(page: number, size: number): Observable<PageResponse<EmpleadoResponse>> {
    return this.apiClient.get<PageResponse<EmpleadoResponse>>(API_CONFIG.empleadosPath, {
      page,
      size
    });
  }

  getByClave(clave: string): Observable<EmpleadoResponse> {
    return this.apiClient.get<EmpleadoResponse>(`${API_CONFIG.empleadosPath}/${clave}`);
  }

  create(payload: EmpleadoRequest): Observable<EmpleadoResponse> {
    return this.apiClient.post<EmpleadoResponse>(API_CONFIG.empleadosPath, payload);
  }

  update(clave: string, payload: EmpleadoRequest): Observable<EmpleadoResponse> {
    return this.apiClient.put<EmpleadoResponse>(`${API_CONFIG.empleadosPath}/${clave}`, payload);
  }

  delete(clave: string): Observable<void> {
    return this.apiClient.delete<void>(`${API_CONFIG.empleadosPath}/${clave}`);
  }
}
