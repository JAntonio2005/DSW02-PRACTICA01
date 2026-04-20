import { environment } from '../../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiBaseUrl,
  authLoginPath: '/api/auth/login',
  empleadosPath: '/api/v2/empleados',
  departamentosPath: '/api/v2/departamentos'
} as const;
