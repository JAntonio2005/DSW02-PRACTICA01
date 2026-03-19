import { of } from 'rxjs';
import { ApiClientService } from '../../core/http/api-client.service';
import { API_CONFIG } from '../../core/config/api.config';
import { EmpleadosService } from './empleados.service';

describe('EmpleadosService', () => {
  let service: EmpleadosService;
  let apiClient: jasmine.SpyObj<ApiClientService>;

  beforeEach(() => {
    apiClient = jasmine.createSpyObj<ApiClientService>('ApiClientService', ['get', 'post', 'put', 'delete']);
    service = new EmpleadosService(apiClient);
  });

  it('requests paginated empleados with page and size', () => {
    const pageResponse = {
      content: [
        {
          clave: 'EMP-1',
          nombre: 'Juan',
          direccion: 'Centro',
          telefono: '9991112233',
          departamentoClave: 'DEP-1'
        }
      ],
      number: 0,
      size: 10,
      totalElements: 1,
      totalPages: 1
    };
    apiClient.get.and.returnValue(of(pageResponse));

    service.getPage(0, 10).subscribe((response) => {
      expect(response).toEqual(pageResponse);
    });

    expect(apiClient.get).toHaveBeenCalledWith(API_CONFIG.empleadosPath, {
      page: 0,
      size: 10
    });
  });

  it('creates empleado using POST /api/v2/empleados', () => {
    const payload = {
      clave: 'EMP-2',
      nombre: 'Ana',
      direccion: 'Norte',
      telefono: '9990001111',
      departamentoClave: 'DEP-1'
    };
    apiClient.post.and.returnValue(of(payload));

    service.create(payload).subscribe((response) => {
      expect(response).toEqual(payload);
    });

    expect(apiClient.post).toHaveBeenCalledWith(API_CONFIG.empleadosPath, payload);
  });

  it('updates empleado by clave', () => {
    const payload = {
      clave: 'EMP-1',
      nombre: 'Juan Perez',
      direccion: 'Centro',
      telefono: '9991112233',
      departamentoClave: 'DEP-2'
    };
    apiClient.put.and.returnValue(of(payload));

    service.update('EMP-1', payload).subscribe((response) => {
      expect(response).toEqual(payload);
    });

    expect(apiClient.put).toHaveBeenCalledWith(`${API_CONFIG.empleadosPath}/EMP-1`, payload);
  });

  it('deletes empleado by clave', () => {
    apiClient.delete.and.returnValue(of(undefined));

    service.delete('EMP-1').subscribe((response) => {
      expect(response).toBeUndefined();
    });

    expect(apiClient.delete).toHaveBeenCalledWith(`${API_CONFIG.empleadosPath}/EMP-1`);
  });
});
