import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { throwError } from 'rxjs';
import { ApiErrorMapper } from '../../src/app/core/http/api-error.mapper';
import { EmpleadoFormPageComponent } from '../../src/app/features/empleados/empleado-form-page.component';
import { EmpleadosFormComponent } from '../../src/app/features/empleados/empleados-form.component';
import { EmpleadosListPageComponent } from '../../src/app/features/empleados/empleados-list-page.component';
import { EmpleadosService } from '../../src/app/features/empleados/empleados.service';

describe('E2E Empleados Error Flow', () => {
  let serviceMock: jasmine.SpyObj<EmpleadosService>;

  beforeEach(async () => {
    serviceMock = jasmine.createSpyObj<EmpleadosService>('EmpleadosService', [
      'getPage',
      'delete',
      'create',
      'update',
      'getByClave'
    ]);

    await TestBed.configureTestingModule({
      imports: [EmpleadosListPageComponent, EmpleadoFormPageComponent],
      providers: [
        provideRouter([]),
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
  });

  it('maps 409 conflict error on delete', () => {
    const fixture: ComponentFixture<EmpleadosListPageComponent> =
      TestBed.createComponent(EmpleadosListPageComponent);
    const component = fixture.componentInstance;

    serviceMock.getPage.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409 })));
    serviceMock.delete.and.returnValue(
      throwError(() =>
        new HttpErrorResponse({
          status: 409,
          statusText: 'Conflict',
          error: { message: 'Conflicto de negocio' }
        })
      )
    );

    component.remove('EMP-1');

    expect(component.error?.status).toBe(409);
    expect(component.error?.message).toBe('mapped-409');
  });

  it('maps 400 validation error on save', () => {
    const fixture: ComponentFixture<EmpleadoFormPageComponent> =
      TestBed.createComponent(EmpleadoFormPageComponent);
    const component = fixture.componentInstance;

    serviceMock.create.and.returnValue(
      throwError(() =>
        new HttpErrorResponse({
          status: 400,
          statusText: 'Bad Request',
          error: { fieldErrors: { departamentoClave: 'obligatorio' } }
        })
      )
    );

    component.save({
      clave: 'EMP-1',
      nombre: 'Juan',
      direccion: 'Centro',
      telefono: '9991112233',
      departamentoClave: ''
    });

    expect(component.error?.status).toBe(400);
    expect(component.error?.message).toBe('mapped-400');
  });
});

describe('E2E Empleados departamentoClave validation', () => {
  let fixture: ComponentFixture<EmpleadosFormComponent>;
  let component: EmpleadosFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadosFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('does not submit when departamentoClave is missing', () => {
    const submitSpy = spyOn(component.submitted, 'emit');

    component.form.setValue({
      clave: 'EMP-1',
      nombre: 'Juan',
      direccion: 'Centro',
      telefono: '9991112233',
      departamentoClave: ''
    });

    component.submit();

    expect(component.form.valid).toBeFalse();
    expect(component.form.controls.departamentoClave.errors).toBeTruthy();
    expect(submitSpy).not.toHaveBeenCalled();
  });
});
