import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorMapper } from '../../core/http/api-error.mapper';
import { ApiErrorViewModel } from '../../core/http/api.models';
import { ApiErrorBannerComponent } from '../../shared/ui/api-error-banner.component';
import { EmpleadoRequest } from './empleados.models';
import { EmpleadosService } from './empleados.service';
import { EmpleadosFormComponent } from './empleados-form.component';

@Component({
  selector: 'app-empleado-form-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ApiErrorBannerComponent, EmpleadosFormComponent],
  template: `
    <section class="page-shell">
      <h1>{{ editMode ? 'Editar empleado' : 'Nuevo empleado' }}</h1>
      <p class="section-link"><a routerLink="/empleados">Regresar al listado</a></p>

      <app-api-error-banner [error]="error" />

      <div class="surface-panel">
        <app-empleados-form
          [initialValue]="initialValue"
          [loading]="loading"
          [readonlyClave]="editMode"
          (submitted)="save($event)"
        />
      </div>
    </section>
  `
})
export class EmpleadoFormPageComponent implements OnInit {
  editMode = false;
  loading = false;
  error: ApiErrorViewModel | null = null;
  initialValue: EmpleadoRequest | null = null;
  private currentClave: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly empleadosService: EmpleadosService,
    private readonly apiErrorMapper: ApiErrorMapper
  ) {}

  ngOnInit(): void {
    this.currentClave = this.route.snapshot.paramMap.get('clave');
    this.editMode = Boolean(this.currentClave);

    if (!this.currentClave) {
      return;
    }

    this.loading = true;
    this.empleadosService.getByClave(this.currentClave).subscribe({
      next: (response) => {
        this.loading = false;
        this.initialValue = {
          clave: response.clave,
          nombre: response.nombre,
          direccion: response.direccion,
          telefono: response.telefono,
          departamentoClave: response.departamentoClave
        };
      },
      error: (error: unknown) => {
        this.loading = false;
        if (error instanceof HttpErrorResponse) {
          this.error = this.apiErrorMapper.toViewModel(error);
          return;
        }
        this.error = { status: 0, message: 'No fue posible cargar el empleado.' };
      }
    });
  }

  save(payload: EmpleadoRequest): void {
    this.loading = true;
    this.error = null;

    const request$ = this.editMode && this.currentClave
      ? this.empleadosService.update(this.currentClave, payload)
      : this.empleadosService.create(payload);

    request$.subscribe({
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
        this.error = { status: 0, message: 'No fue posible guardar el empleado.' };
      }
    });
  }
}
