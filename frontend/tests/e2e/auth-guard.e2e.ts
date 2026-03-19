import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthService } from '../../src/app/core/auth/auth.service';
import { authGuard } from '../../src/app/core/auth/auth.guard';

@Component({
  standalone: true,
  template: ''
})
class DummyLoginPageComponent {}

@Component({
  standalone: true,
  template: ''
})
class DummyPrivatePageComponent {}

describe('E2E Auth Guard Flow', () => {
  let router: Router;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated']);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'login', component: DummyLoginPageComponent },
          { path: 'empleados', component: DummyPrivatePageComponent, canActivate: [authGuard] }
        ]),
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    router = TestBed.inject(Router);
  });

  it('redirects to /login when trying to access private route without token', fakeAsync(() => {
    authServiceMock.isAuthenticated.and.returnValue(false);

    void router.navigateByUrl('/empleados');
    tick();

    expect(router.url).toBe('/login');
  }));

  it('allows access to private route when token/session exists', fakeAsync(() => {
    authServiceMock.isAuthenticated.and.returnValue(true);

    void router.navigateByUrl('/empleados');
    tick();

    expect(router.url).toBe('/empleados');
  }));
});
