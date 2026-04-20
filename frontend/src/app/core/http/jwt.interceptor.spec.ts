import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { SessionStore } from '../auth/session.store';
import { API_CONFIG } from '../config/api.config';
import { jwtInterceptor } from './jwt.interceptor';
import { HttpClient } from '@angular/common/http';

describe('jwtInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let sessionStore: SessionStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionStore,
        provideRouter([]),
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStore = TestBed.inject(SessionStore);
    router = TestBed.inject(Router);

    sessionStorage.clear();
    spyOn(router, 'navigate').and.resolveTo(true);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('attaches bearer token to private API requests', () => {
    sessionStore.setToken('jwt-token');

    http.get(`${API_CONFIG.baseUrl}${API_CONFIG.empleadosPath}`).subscribe();

    const request = httpMock.expectOne(`${API_CONFIG.baseUrl}${API_CONFIG.empleadosPath}`);
    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    request.flush({});
  });

  it('does not attach bearer token to login request', () => {
    sessionStore.setToken('jwt-token');

    http.post(`${API_CONFIG.baseUrl}${API_CONFIG.authLoginPath}`, {}).subscribe();

    const request = httpMock.expectOne(`${API_CONFIG.baseUrl}${API_CONFIG.authLoginPath}`);
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({ token: 'new-token' });
  });

  it('clears session and redirects to /login on 401', () => {
    sessionStore.setToken('jwt-token');
    let receivedStatus = 0;

    http.get(`${API_CONFIG.baseUrl}${API_CONFIG.empleadosPath}`).subscribe({
      error: (error: HttpErrorResponse) => {
        receivedStatus = error.status;
      }
    });

    const request = httpMock.expectOne(`${API_CONFIG.baseUrl}${API_CONFIG.empleadosPath}`);
    request.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(receivedStatus).toBe(401);
    expect(sessionStore.getToken()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
