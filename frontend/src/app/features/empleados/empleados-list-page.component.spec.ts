import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiErrorMapper } from '../../core/http/api-error.mapper';
import { EmpleadosListPageComponent } from './empleados-list-page.component';
import { EmpleadosService } from './empleados.service';

describe('EmpleadosListPageComponent', () => {
  let fixture: ComponentFixture<EmpleadosListPageComponent>;
  let component: EmpleadosListPageComponent;
  let serviceMock: jasmine.SpyObj<EmpleadosService>;

  beforeEach(async () => {
    serviceMock = jasmine.createSpyObj<EmpleadosService>('EmpleadosService', ['getPage', 'delete']);

    await TestBed.configureTestingModule({
      imports: [EmpleadosListPageComponent],
      providers: [
        { provide: EmpleadosService, useValue: serviceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } }
          }
        },
        {
          provide: ApiErrorMapper,
          useValue: {
            toViewModel: (error: HttpErrorResponse) => ({
              status: error.status,
              message: `mapped-${error.status}`
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadosListPageComponent);
    component = fixture.componentInstance;
  });

  it('loads paginated empleados on init and renders table rows', () => {
    serviceMock.getPage.and.returnValue(
      of({
        content: [
          {
            clave: 'EMP-1',
            nombre: 'Juan',
            direccion: 'Centro',
            telefono: '9991112233',
            departamentoClave: 'DEP-1'
          },
          {
            clave: 'EMP-2',
            nombre: 'Ana',
            direccion: 'Norte',
            telefono: '9990001111',
            departamentoClave: 'DEP-2'
          }
        ],
        number: 0,
        size: 10,
        totalElements: 2,
        totalPages: 1
      })
    );

    fixture.detectChanges();

    expect(serviceMock.getPage).toHaveBeenCalledWith(0, 10);
    expect(component.items.length).toBe(2);

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('changes page and requests new pagination data', () => {
    serviceMock.getPage.and.returnValue(
      of({ content: [], number: 0, size: 10, totalElements: 0, totalPages: 0 })
    );

    fixture.detectChanges();
    component.onPageChanged(2);

    expect(serviceMock.getPage).toHaveBeenCalledWith(2, 10);
  });

  it('deletes empleado and reloads list', () => {
    serviceMock.getPage.and.returnValue(
      of({ content: [], number: 0, size: 10, totalElements: 0, totalPages: 0 })
    );
    serviceMock.delete.and.returnValue(of(undefined));

    fixture.detectChanges();
    serviceMock.getPage.calls.reset();

    component.remove('EMP-1');

    expect(serviceMock.delete).toHaveBeenCalledWith('EMP-1');
    expect(serviceMock.getPage).toHaveBeenCalledWith(0, 10);
  });

  it('maps 409 conflict error on delete', () => {
    serviceMock.getPage.and.returnValue(
      of({ content: [], number: 0, size: 10, totalElements: 0, totalPages: 0 })
    );
    serviceMock.delete.and.returnValue(
      throwError(() =>
        new HttpErrorResponse({
          status: 409,
          statusText: 'Conflict',
          error: { message: 'Conflicto de negocio' }
        })
      )
    );

    fixture.detectChanges();
    component.remove('EMP-1');

    expect(component.error?.status).toBe(409);
    expect(component.error?.message).toBe('mapped-409');
  });
});
