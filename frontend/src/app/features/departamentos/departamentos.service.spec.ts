import { of } from 'rxjs';
import { ApiClientService } from '../../core/http/api-client.service';
import { DepartamentosService } from './departamentos.service';
import { API_CONFIG } from '../../core/config/api.config';

describe('DepartamentosService', () => {
  let service: DepartamentosService;
  let apiClient: jasmine.SpyObj<ApiClientService>;

  beforeEach(() => {
    apiClient = jasmine.createSpyObj<ApiClientService>('ApiClientService', [
      'get',
      'post',
      'put',
      'delete'
    ]);
    service = new DepartamentosService(apiClient);
  });

  it('requests paginated list with page and size', () => {
    const pageResponse = {
      content: [{ clave: 'DEP-1', nombre: 'RH' }],
      number: 0,
      size: 10,
      totalElements: 1,
      totalPages: 1
    };
    apiClient.get.and.returnValue(of(pageResponse));

    service.getPage(0, 10).subscribe((response) => {
      expect(response).toEqual(pageResponse);
    });

    expect(apiClient.get).toHaveBeenCalledWith(API_CONFIG.departamentosPath, {
      page: 0,
      size: 10
    });
  });

  it('creates departamento using POST /api/v2/departamentos', () => {
    const payload = { clave: 'DEP-2', nombre: 'Finanzas' };
    apiClient.post.and.returnValue(of(payload));

    service.create(payload).subscribe((response) => {
      expect(response).toEqual(payload);
    });

    expect(apiClient.post).toHaveBeenCalledWith(API_CONFIG.departamentosPath, payload);
  });

  it('updates departamento by clave', () => {
    const payload = { clave: 'DEP-1', nombre: 'Recursos Humanos' };
    apiClient.put.and.returnValue(of(payload));

    service.update('DEP-1', payload).subscribe((response) => {
      expect(response).toEqual(payload);
    });

    expect(apiClient.put).toHaveBeenCalledWith(`${API_CONFIG.departamentosPath}/DEP-1`, payload);
  });

  it('deletes departamento by clave', () => {
    apiClient.delete.and.returnValue(of(undefined));

    service.delete('DEP-1').subscribe((response) => {
      expect(response).toBeUndefined();
    });

    expect(apiClient.delete).toHaveBeenCalledWith(`${API_CONFIG.departamentosPath}/DEP-1`);
  });
});
