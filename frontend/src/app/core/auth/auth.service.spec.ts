import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ApiClientService } from '../http/api-client.service';
import { API_CONFIG } from '../config/api.config';
import { AuthService } from './auth.service';
import { SessionStore } from './session.store';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let sessionStore: SessionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        ApiClientService,
        SessionStore,
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStore = TestBed.inject(SessionStore);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('logs in successfully and persists token in client session', () => {
    let completed = false;

    service.login({ correo: 'admin@empresa.com', password: 'admin123' }).subscribe({
      next: () => {
        completed = true;
      }
    });

    const request = httpMock.expectOne(`${API_CONFIG.baseUrl}${API_CONFIG.authLoginPath}`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ correo: 'admin@empresa.com', password: 'admin123' });

    request.flush({ token: 'jwt-token' });

    expect(completed).toBeTrue();
    expect(sessionStore.getToken()).toBe('jwt-token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('propagates invalid login response and does not persist session token', () => {
    let receivedError: HttpErrorResponse | undefined;

    service.login({ correo: 'admin@empresa.com', password: 'wrong' }).subscribe({
      error: (error: HttpErrorResponse) => {
        receivedError = error;
      }
    });

    const request = httpMock.expectOne(`${API_CONFIG.baseUrl}${API_CONFIG.authLoginPath}`);
    request.flush({ message: 'Credenciales inválidas' }, { status: 401, statusText: 'Unauthorized' });

    expect(receivedError?.status).toBe(401);
    expect(sessionStore.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });
});
