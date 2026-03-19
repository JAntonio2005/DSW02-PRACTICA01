import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EmpleadosService } from './empleados.service';
import { EmpleadoResponse } from './empleados.models';
import { ApiErrorMapper } from '../../core/http/api-error.mapper';
import { ApiErrorViewModel } from '../../core/http/api.models';
import { ApiErrorBannerComponent } from '../../shared/ui/api-error-banner.component';
import { PaginationComponent } from '../../shared/ui/pagination.component';

@Component({
  selector: 'app-empleados-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ApiErrorBannerComponent, PaginationComponent],
  template: `
    <h1>Empleados</h1>
    <p><a routerLink="/empleados/nuevo">Nuevo empleado</a></p>

    <app-api-error-banner [error]="error" />

    <table *ngIf="items.length > 0; else emptyState">
      <thead>
        <tr>
          <th>Clave</th>
          <th>Nombre</th>
          <th>Departamento</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of items">
          <td>{{ item.clave }}</td>
          <td>{{ item.nombre }}</td>
          <td>{{ item.departamentoClave }}</td>
          <td>
            <a [routerLink]="['/empleados', item.clave, 'editar']">Editar</a>
            <button type="button" (click)="remove(item.clave)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ng-template #emptyState>
      <p>No hay empleados.</p>
    </ng-template>

    <app-pagination
      [page]="page"
      [totalPages]="totalPages"
      (pageChange)="onPageChanged($event)"
    />
  `
})
export class EmpleadosListPageComponent implements OnInit {
  items: EmpleadoResponse[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  error: ApiErrorViewModel | null = null;

  constructor(
    private readonly empleadosService: EmpleadosService,
    private readonly apiErrorMapper: ApiErrorMapper
  ) {}

  ngOnInit(): void {
    this.load();
  }

  onPageChanged(page: number): void {
    this.page = page;
    this.load();
  }

  remove(clave: string): void {
    this.error = null;
    this.empleadosService.delete(clave).subscribe({
      next: () => this.load(),
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.error = this.apiErrorMapper.toViewModel(error);
          return;
        }
        this.error = { status: 0, message: 'No fue posible eliminar el empleado.' };
      }
    });
  }

  private load(): void {
    this.error = null;
    this.empleadosService.getPage(this.page, this.size).subscribe({
      next: (response) => {
        this.items = response.content;
        this.page = response.number;
        this.size = response.size;
        this.totalPages = response.totalPages;
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.error = this.apiErrorMapper.toViewModel(error);
          return;
        }
        this.error = { status: 0, message: 'No fue posible cargar empleados.' };
      }
    });
  }
}
