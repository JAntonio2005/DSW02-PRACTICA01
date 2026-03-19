import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { ApiErrorMapper } from '../../src/app/core/http/api-error.mapper';
import { DepartamentoFormPageComponent } from '../../src/app/features/departamentos/departamento-form-page.component';
import { DepartamentosListPageComponent } from '../../src/app/features/departamentos/departamentos-list-page.component';
import { DepartamentosService } from '../../src/app/features/departamentos/departamentos.service';

describe('E2E Departamentos CRUD Flow', () => {
  let listFixture: ComponentFixture<DepartamentosListPageComponent>;
  let formFixture: ComponentFixture<DepartamentoFormPageComponent>;
  let serviceMock: jasmine.SpyObj<DepartamentosService>;
  let router: Router;

  beforeEach(async () => {
    serviceMock = jasmine.createSpyObj<DepartamentosService>('DepartamentosService', [
      'getPage',
      'delete',
      'create',
      'update',
      'getByClave'
    ]);

    await TestBed.configureTestingModule({
      imports: [DepartamentosListPageComponent, DepartamentoFormPageComponent],
      providers: [
        provideRouter([]),
        { provide: DepartamentosService, useValue: serviceMock },
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
        content: [{ clave: 'DEP-1', nombre: 'RH' }],
        number: 0,
        size: 10,
        totalElements: 1,
        totalPages: 2
      }),
      of({
        content: [{ clave: 'DEP-2', nombre: 'Finanzas' }],
        number: 1,
        size: 10,
        totalElements: 2,
        totalPages: 2
      }),
      of({
        content: [],
        number: 1,
        size: 10,
        totalElements: 1,
        totalPages: 1
      })
    );
    serviceMock.delete.and.returnValue(of(undefined));
    serviceMock.create.and.returnValue(of({ clave: 'DEP-2', nombre: 'Finanzas' }));
    serviceMock.update.and.returnValue(of({ clave: 'DEP-1', nombre: 'Recursos Humanos' }));

    listFixture = TestBed.createComponent(DepartamentosListPageComponent);
    const listComponent = listFixture.componentInstance;
    listFixture.detectChanges();

    expect(listComponent.items[0].clave).toBe('DEP-1');

    listComponent.onPageChanged(1);
    expect(serviceMock.getPage).toHaveBeenCalledWith(1, 10);

    formFixture = TestBed.createComponent(DepartamentoFormPageComponent);
    const formComponent = formFixture.componentInstance;
    formFixture.detectChanges();

    formComponent.save({ clave: 'DEP-2', nombre: 'Finanzas' });
    tick();
    expect(serviceMock.create).toHaveBeenCalledWith({ clave: 'DEP-2', nombre: 'Finanzas' });

    formComponent.editMode = true;
    (formComponent as unknown as { currentClave: string | null }).currentClave = 'DEP-1';
    formComponent.save({ clave: 'DEP-1', nombre: 'Recursos Humanos' });
    tick();
    expect(serviceMock.update).toHaveBeenCalledWith('DEP-1', {
      clave: 'DEP-1',
      nombre: 'Recursos Humanos'
    });

    listComponent.remove('DEP-1');
    expect(serviceMock.delete).toHaveBeenCalledWith('DEP-1');
  }));
});
