import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { ApiErrorMapper } from '../../src/app/core/http/api-error.mapper';
import { EmpleadoFormPageComponent } from '../../src/app/features/empleados/empleado-form-page.component';
import { EmpleadosListPageComponent } from '../../src/app/features/empleados/empleados-list-page.component';
import { EmpleadosService } from '../../src/app/features/empleados/empleados.service';

describe('E2E Empleados CRUD Flow', () => {
  let listFixture: ComponentFixture<EmpleadosListPageComponent>;
  let formFixture: ComponentFixture<EmpleadoFormPageComponent>;
  let serviceMock: jasmine.SpyObj<EmpleadosService>;
  let router: Router;

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
            snapshot: {
              paramMap: { get: () => null }
            }
          }
        },
        {
          provide: ApiErrorMapper,
          useValue: {
            toViewModel: (error: { status: number }) => ({ status: error.status, message: 'mapped' })
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
  });

  it('supports list pagination create edit and delete', fakeAsync(() => {
    serviceMock.getPage.and.returnValues(
      of({
        content: [
          {
            clave: 'EMP-1',
            nombre: 'Juan',
            direccion: 'Centro',
            telefono: '9991112233',
            departamentoClave: 'DEP-1'
          }
        ],
        number: 0,
        size: 10,
        totalElements: 1,
        totalPages: 2
      }),
      of({
        content: [
          {
            clave: 'EMP-2',
            nombre: 'Ana',
            direccion: 'Norte',
            telefono: '9990001111',
            departamentoClave: 'DEP-2'
          }
        ],
        number: 1,
        size: 10,
        totalElements: 2,
        totalPages: 2
      }),
      of({ content: [], number: 1, size: 10, totalElements: 1, totalPages: 1 })
    );
    serviceMock.delete.and.returnValue(of(undefined));
    serviceMock.create.and.returnValue(
      of({
        clave: 'EMP-2',
        nombre: 'Ana',
        direccion: 'Norte',
        telefono: '9990001111',
        departamentoClave: 'DEP-2'
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

    listFixture = TestBed.createComponent(EmpleadosListPageComponent);
    const listComponent = listFixture.componentInstance;
    listFixture.detectChanges();

    expect(listComponent.items[0].clave).toBe('EMP-1');

    listComponent.onPageChanged(1);
    expect(serviceMock.getPage).toHaveBeenCalledWith(1, 10);

    formFixture = TestBed.createComponent(EmpleadoFormPageComponent);
    const formComponent = formFixture.componentInstance;
    formFixture.detectChanges();

    formComponent.save({
      clave: 'EMP-2',
      nombre: 'Ana',
      direccion: 'Norte',
      telefono: '9990001111',
      departamentoClave: 'DEP-2'
    });
    tick();
    expect(serviceMock.create).toHaveBeenCalled();

    formComponent.editMode = true;
    (formComponent as unknown as { currentClave: string | null }).currentClave = 'EMP-1';
    formComponent.save({
      clave: 'EMP-1',
      nombre: 'Juan Perez',
      direccion: 'Centro',
      telefono: '9991112233',
      departamentoClave: 'DEP-2'
    });
    tick();
    expect(serviceMock.update).toHaveBeenCalledWith('EMP-1', {
      clave: 'EMP-1',
      nombre: 'Juan Perez',
      direccion: 'Centro',
      telefono: '9991112233',
      departamentoClave: 'DEP-2'
    });

    listComponent.remove('EMP-1');
    expect(serviceMock.delete).toHaveBeenCalledWith('EMP-1');
  }));
});
