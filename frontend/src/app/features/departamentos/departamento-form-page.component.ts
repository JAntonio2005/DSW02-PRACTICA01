import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorMapper } from '../../core/http/api-error.mapper';
import { ApiErrorViewModel } from '../../core/http/api.models';
import { ApiErrorBannerComponent } from '../../shared/ui/api-error-banner.component';
import { DepartamentoRequest } from './departamentos.models';
import { DepartamentosService } from './departamentos.service';
import { DepartamentosFormComponent } from './departamentos-form.component';

@Component({
  selector: 'app-departamento-form-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ApiErrorBannerComponent, DepartamentosFormComponent],
  template: `
    <section class="page-shell">
      <h1>{{ editMode ? 'Editar departamento' : 'Nuevo departamento' }}</h1>
      <p class="section-link"><a routerLink="/departamentos">Regresar al listado</a></p>

      <app-api-error-banner [error]="error" />

      <div class="surface-panel">
        <app-departamentos-form
          [initialValue]="initialValue"
          [loading]="loading"
          [readonlyClave]="editMode"
          (submitted)="save($event)"
        />
      </div>
    </section>
  `
})
export class DepartamentoFormPageComponent implements OnInit {
  editMode = false;
  loading = false;
  error: ApiErrorViewModel | null = null;
  initialValue: DepartamentoRequest | null = null;
  private currentClave: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly departamentosService: DepartamentosService,
    private readonly apiErrorMapper: ApiErrorMapper
  ) {}

  ngOnInit(): void {
    this.currentClave = this.route.snapshot.paramMap.get('clave');
    this.editMode = Boolean(this.currentClave);

    if (!this.currentClave) {
      return;
    }

    this.loading = true;
    this.departamentosService.getByClave(this.currentClave).subscribe({
      next: (response) => {
        this.loading = false;
        this.initialValue = { clave: response.clave, nombre: response.nombre };
      },
      error: (error: unknown) => {
        this.loading = false;
        if (error instanceof HttpErrorResponse) {
          this.error = this.apiErrorMapper.toViewModel(error);
          return;
        }
        this.error = { status: 0, message: 'No fue posible cargar el departamento.' };
      }
    });
  }

  save(payload: DepartamentoRequest): void {
    this.loading = true;
    this.error = null;

    const request$ = this.editMode && this.currentClave
      ? this.departamentosService.update(this.currentClave, payload)
      : this.departamentosService.create(payload);

    request$.subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/departamentos']);
      },
      error: (error: unknown) => {
        this.loading = false;
        if (error instanceof HttpErrorResponse) {
          this.error = this.apiErrorMapper.toViewModel(error);
          return;
        }
        this.error = { status: 0, message: 'No fue posible guardar el departamento.' };
      }
    });
  }
}
