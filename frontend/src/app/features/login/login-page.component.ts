import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { ApiErrorMapper } from '../../core/http/api-error.mapper';
import { ApiErrorViewModel } from '../../core/http/api.models';
import { ApiErrorBannerComponent } from '../../shared/ui/api-error-banner.component';
import { LoginFormComponent } from './login-form.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent, ApiErrorBannerComponent],
  template: `
    <h1>Iniciar sesión</h1>
    <app-api-error-banner [error]="error" />
    <app-login-form [loading]="loading" (loginSubmitted)="onLogin($event)" />
  `
})
export class LoginPageComponent {
  loading = false;
  error: ApiErrorViewModel | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly apiErrorMapper: ApiErrorMapper
  ) {}

  onLogin(payload: { correo: string; password: string }): void {
    this.loading = true;
    this.error = null;

    this.authService.login(payload).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/empleados']);
      },
      error: (error: unknown) => {
        this.loading = false;
        if (error instanceof HttpErrorResponse) {
          this.error = this.apiErrorMapper.toViewModel(error);
          return;
        }
        this.error = {
          status: 0,
          message: 'No fue posible iniciar sesión.'
        };
      }
    });
  }
}
