import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiErrorMapper } from '../../core/http/api-error.mapper';
import { DepartamentoFormPageComponent } from './departamento-form-page.component';
import { DepartamentosService } from './departamentos.service';

describe('DepartamentoFormPageComponent', () => {
  let fixture: ComponentFixture<DepartamentoFormPageComponent>;
  let component: DepartamentoFormPageComponent;
  let serviceMock: jasmine.SpyObj<DepartamentosService>;
  let router: Router;

  async function setupWithClave(clave: string | null): Promise<void> {
    serviceMock = jasmine.createSpyObj<DepartamentosService>('DepartamentosService', [
      'getByClave',
      'create',
      'update'
    ]);

    await TestBed.configureTestingModule({
      imports: [DepartamentoFormPageComponent],
      providers: [
        provideRouter([]),
        { provide: DepartamentosService, useValue: serviceMock },
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

    fixture = TestBed.createComponent(DepartamentoFormPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
  }

  it('creates departamento in create mode', async () => {
    await setupWithClave(null);
    serviceMock.create.and.returnValue(of({ clave: 'DEP-1', nombre: 'RH' }));

    fixture.detectChanges();
    component.save({ clave: 'DEP-1', nombre: 'RH' });

    expect(serviceMock.create).toHaveBeenCalledWith({ clave: 'DEP-1', nombre: 'RH' });
    expect(router.navigate).toHaveBeenCalledWith(['/departamentos']);
  });

  it('loads and updates departamento in edit mode', async () => {
    await setupWithClave('DEP-1');
    serviceMock.getByClave.and.returnValue(of({ clave: 'DEP-1', nombre: 'Recursos Humanos' }));
    serviceMock.update.and.returnValue(of({ clave: 'DEP-1', nombre: 'Finanzas' }));

    fixture.detectChanges();

    expect(component.editMode).toBeTrue();
    expect(serviceMock.getByClave).toHaveBeenCalledWith('DEP-1');
    expect(component.initialValue).toEqual({ clave: 'DEP-1', nombre: 'Recursos Humanos' });

    component.save({ clave: 'DEP-1', nombre: 'Finanzas' });

    expect(serviceMock.update).toHaveBeenCalledWith('DEP-1', { clave: 'DEP-1', nombre: 'Finanzas' });
    expect(router.navigate).toHaveBeenCalledWith(['/departamentos']);
  });

  it('maps 400 validation error on save', async () => {
    await setupWithClave(null);
    serviceMock.create.and.returnValue(
      throwError(() =>
        new HttpErrorResponse({
          status: 400,
          statusText: 'Bad Request',
          error: { fieldErrors: { nombre: 'obligatorio' } }
        })
      )
    );

    fixture.detectChanges();
    component.save({ clave: '', nombre: '' });

    expect(component.error?.status).toBe(400);
    expect(component.error?.message).toBe('mapped-400');
  });
});
