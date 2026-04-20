import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { requiredTrimmed } from '../../shared/forms/validators';
import { DepartamentoRequest } from './departamentos.models';

@Component({
  selector: 'app-departamentos-form',
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
export class DepartamentosFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Input() set initialValue(value: DepartamentoRequest | null) {
    if (value) {
      this.form.patchValue(value);
    }
  }
  @Input() loading = false;
  @Input() readonlyClave = false;
  @Output() submitted = new EventEmitter<DepartamentoRequest>();

  readonly form = this.formBuilder.group({
    clave: ['', [Validators.required, requiredTrimmed()]],
    nombre: ['', [Validators.required, requiredTrimmed()]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.submitted.emit({
      clave: value.clave ?? '',
      nombre: value.nombre ?? ''
    });
  }
}
