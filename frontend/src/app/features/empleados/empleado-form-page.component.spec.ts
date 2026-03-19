import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiErrorMapper } from '../../core/http/api-error.mapper';
import { EmpleadoFormPageComponent } from './empleado-form-page.component';
import { EmpleadosFormComponent } from './empleados-form.component';
import { EmpleadosService } from './empleados.service';

describe('EmpleadoFormPageComponent', () => {
  let fixture: ComponentFixture<EmpleadoFormPageComponent>;
  let component: EmpleadoFormPageComponent;
  let serviceMock: jasmine.SpyObj<EmpleadosService>;
  let router: Router;

  async function setupWithClave(clave: string | null): Promise<void> {
    serviceMock = jasmine.createSpyObj<EmpleadosService>('EmpleadosService', [
      'getByClave',
      'create',
      'update'
    ]);

    await TestBed.configureTestingModule({
      imports: [EmpleadoFormPageComponent],
      providers: [
        provideRouter([]),
        { provide: EmpleadosService, useValue: serviceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => clave
              }
            }
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

    fixture = TestBed.createComponent(EmpleadoFormPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
  }

  it('creates empleado in create mode', async () => {
    await setupWithClave(null);
    serviceMock.create.and.returnValue(
      of({
        clave: 'EMP-1',
        nombre: 'Juan',
        direccion: 'Centro',
        telefono: '9991112233',
        departamentoClave: 'DEP-1'
      })
    );

    fixture.detectChanges();
    component.save({
      clave: 'EMP-1',
      nombre: 'Juan',
      direccion: 'Centro',
      telefono: '9991112233',
      departamentoClave: 'DEP-1'
    });

    expect(serviceMock.create).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/empleados']);
  });

  it('loads and updates empleado in edit mode', async () => {
    await setupWithClave('EMP-1');
    serviceMock.getByClave.and.returnValue(
      of({
        clave: 'EMP-1',
        nombre: 'Juan',
        direccion: 'Centro',
        telefono: '9991112233',
        departamentoClave: 'DEP-1'
      })
    );
    serviceMock.update.and.returnValue(
      of({
        clave: 'EMP-1',
        nombre: 'Juan Perez',
        direccion: 'Centro',
        telefono: '9991112233',
        departamentoClave: 'DEP-2'
      })
    );

    fixture.detectChanges();

    expect(component.editMode).toBeTrue();
    expect(serviceMock.getByClave).toHaveBeenCalledWith('EMP-1');
    expect(component.initialValue?.departamentoClave).toBe('DEP-1');

    component.save({
      clave: 'EMP-1',
      nombre: 'Juan Perez',
      direccion: 'Centro',
      telefono: '9991112233',
      departamentoClave: 'DEP-2'
    });

    expect(serviceMock.update).toHaveBeenCalledWith('EMP-1', {
      clave: 'EMP-1',
      nombre: 'Juan Perez',
      direccion: 'Centro',
      telefono: '9991112233',
      departamentoClave: 'DEP-2'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/empleados']);
  });

  it('maps 400 validation error on save', async () => {
    await setupWithClave(null);
    serviceMock.create.and.returnValue(
      throwError(() =>
        new HttpErrorResponse({
          status: 400,
          statusText: 'Bad Request',
          error: { fieldErrors: { departamentoClave: 'obligatorio' } }
        })
      )
    );

    fixture.detectChanges();
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

describe('EmpleadosFormComponent departamentoClave validation', () => {
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

  it('requires departamentoClave before submit', () => {
    const submittedSpy = spyOn(component.submitted, 'emit');

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
    expect(submittedSpy).not.toHaveBeenCalled();
  });
});
