import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiErrorMapper } from '../../core/http/api-error.mapper';
import { DepartamentosService } from './departamentos.service';
import { DepartamentosListPageComponent } from './departamentos-list-page.component';

describe('DepartamentosListPageComponent', () => {
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
              message: `mapped-${error.status}`
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DepartamentosListPageComponent);
    component = fixture.componentInstance;
  });

  it('loads paginated departamentos on init and renders table rows', () => {
    serviceMock.getPage.and.returnValue(
      of({
        content: [
          { clave: 'DEP-1', nombre: 'RH' },
          { clave: 'DEP-2', nombre: 'Finanzas' }
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

  it('deletes departamento and reloads list', () => {
    serviceMock.getPage.and.returnValue(
      of({ content: [], number: 0, size: 10, totalElements: 0, totalPages: 0 })
    );
    serviceMock.delete.and.returnValue(of(undefined));

    fixture.detectChanges();
    serviceMock.getPage.calls.reset();

    component.remove('DEP-1');

    expect(serviceMock.delete).toHaveBeenCalledWith('DEP-1');
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
          error: { message: 'Asociados' }
        })
      )
    );

    fixture.detectChanges();
    component.remove('DEP-1');

    expect(component.error?.status).toBe(409);
    expect(component.error?.message).toBe('mapped-409');
  });
});
