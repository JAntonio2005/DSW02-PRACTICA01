import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiClientService } from '../http/api-client.service';
import { LoginRequest, LoginResponse } from '../http/api.models';
import { SessionStore } from './session.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly apiClient: ApiClientService,
    private readonly sessionStore: SessionStore,
    private readonly router: Router
  ) {}

  login(request: LoginRequest): Observable<void> {
    return this.apiClient.post<LoginResponse>(API_CONFIG.authLoginPath, request).pipe(
      tap((response) => this.sessionStore.setToken(response.token)),
      map(() => undefined)
    );
  }

  logout(redirectToLogin = true): void {
    this.sessionStore.clear();
    if (redirectToLogin) {
      void this.router.navigate(['/login']);
    }
  }

  isAuthenticated(): boolean {
    return this.sessionStore.isAuthenticated();
  }
}
