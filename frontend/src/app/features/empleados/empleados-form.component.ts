import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { requiredDepartamentoClave, requiredTrimmed } from '../../shared/forms/validators';
import { EmpleadoRequest } from './empleados.models';

@Component({
  selector: 'app-empleados-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="entity-form">
      <label>
        Clave
        <input formControlName="clave" [readonly]="readonlyClave" />
      </label>

      <label>
        Nombre
        <input formControlName="nombre" />
      </label>

      <label>
        Dirección
        <input formControlName="direccion" />
      </label>

      <label>
        Teléfono
        <input formControlName="telefono" />
      </label>

      <label>
        Departamento (clave)
        <input formControlName="departamentoClave" />
      </label>

      <button type="submit" [disabled]="loading || form.invalid">Guardar</button>
    </form>
  `,
  styles: [
    `
      .entity-form {
        display: grid;
        gap: 12px;
        max-width: 420px;
      }
      label {
        display: grid;
        gap: 6px;
      }
      input {
        padding: 8px;
      }
      button {
        width: fit-content;
        padding: 8px 12px;
      }
    `
  ]
})
export class EmpleadosFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Input() set initialValue(value: EmpleadoRequest | null) {
    if (value) {
      this.form.patchValue(value);
    }
  }
  @Input() loading = false;
  @Input() readonlyClave = false;
  @Output() submitted = new EventEmitter<EmpleadoRequest>();

  readonly form = this.formBuilder.group({
    clave: ['', [Validators.required, requiredTrimmed()]],
    nombre: ['', [Validators.required, requiredTrimmed()]],
    direccion: ['', [Validators.required, requiredTrimmed()]],
    telefono: ['', [Validators.required, requiredTrimmed()]],
    departamentoClave: ['', [Validators.required, requiredDepartamentoClave()]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.submitted.emit({
      clave: value.clave ?? '',
      nombre: value.nombre ?? '',
      direccion: value.direccion ?? '',
      telefono: value.telefono ?? '',
      departamentoClave: value.departamentoClave ?? ''
    });
  }
}
