import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { throwError } from 'rxjs';
import { ApiErrorMapper } from '../../src/app/core/http/api-error.mapper';
import { DepartamentosListPageComponent } from '../../src/app/features/departamentos/departamentos-list-page.component';
import { DepartamentosService } from '../../src/app/features/departamentos/departamentos.service';

describe('E2E Departamentos Conflict Flow', () => {
  let fixture: ComponentFixture<DepartamentosListPageComponent>;
  let component: DepartamentosListPageComponent;
  let serviceMock: jasmine.SpyObj<DepartamentosService>;

  beforeEach(async () => {
    serviceMock = jasmine.createSpyObj<DepartamentosService>('DepartamentosService', [
      'getPage',
      'delete'
    ]);

    await TestBed.configureTestingModule({
      imports: [DepartamentosListPageComponent],
      providers: [
        provideRouter([]),
        { provide: DepartamentosService, useValue: serviceMock },
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
              message: 'No se puede eliminar: departamento con empleados asociados.'
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DepartamentosListPageComponent);
    component = fixture.componentInstance;
  });

  it('shows 409 conflict message when deleting departamento with asociados', () => {
    serviceMock.getPage.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 409, statusText: 'Conflict' }))
    );
    serviceMock.delete.and.returnValue(
      throwError(() =>
        new HttpErrorResponse({
          status: 409,
          statusText: 'Conflict',
          error: { message: 'Departamento con empleados asociados' }
        })
      )
    );

    component.remove('DEP-1');

    expect(component.error?.status).toBe(409);
    expect(component.error?.message).toContain('departamento con empleados asociados');
  });
});
