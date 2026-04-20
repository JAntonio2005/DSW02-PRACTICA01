import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../src/app/core/auth/auth.service';
import { ApiErrorMapper } from '../../src/app/core/http/api-error.mapper';
import { LoginPageComponent } from '../../src/app/features/login/login-page.component';

@Component({
  standalone: true,
  template: ''
})
class DummyEmpleadosPageComponent {}

describe('E2E Auth Login Flow', () => {
  let router: Router;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['login']);

    TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideRouter([{ path: 'empleados', component: DummyEmpleadosPageComponent }]),
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: ApiErrorMapper,
          useValue: {
            toViewModel: () => ({ status: 401, message: 'Credenciales inválidas.' })
          }
        }
      ]
    });

    router = TestBed.inject(Router);
  });

  it('redirects to /empleados on successful login', fakeAsync(() => {
    authServiceMock.login.and.returnValue(of(undefined));

    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance;

    component.onLogin({ correo: 'admin@empresa.com', password: 'admin123' });
    tick();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      correo: 'admin@empresa.com',
      password: 'admin123'
    });
    expect(router.url).toBe('/empleados');
  }));

  it('keeps user on login and shows error on invalid login', () => {
    authServiceMock.login.and.returnValue(
      throwError(() =>
        new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
          error: { message: 'Credenciales inválidas' }
        })
      )
    );

    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance;

    component.onLogin({ correo: 'admin@empresa.com', password: 'wrong' });

    expect(router.url).not.toBe('/empleados');
    expect(component.error?.status).toBe(401);
  });
});
