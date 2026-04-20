import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { SessionStore } from '../auth/session.store';

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const sessionStore = inject(SessionStore);
  const router = inject(Router);

  const token = sessionStore.getToken();
  const isLoginRequest = req.url.endsWith(API_CONFIG.authLoginPath);

  const authReq = token && !isLoginRequest
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        sessionStore.clear();
        void router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
