import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { requiredTrimmed } from '../../shared/forms/validators';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
      <label>
        Correo
        <input type="email" formControlName="correo" />
      </label>

      <label>
        Password
        <input type="password" formControlName="password" />
      </label>

      <button type="submit" [disabled]="loading || form.invalid">Ingresar</button>
    </form>
  `,
  styles: [
    `
      .login-form {
        display: grid;
        gap: 14px;
        max-width: 100%;
      }

      label {
        display: grid;
        gap: 6px;
        color: #d6cbf5;
        font-size: 0.85rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      input {
        padding: 11px 12px;
      }

      button {
        margin-top: 4px;
        width: 100%;
        padding: 11px;
      }
    `
  ]
})
export class LoginFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Input() loading = false;
  @Output() loginSubmitted = new EventEmitter<{ correo: string; password: string }>();

  readonly form = this.formBuilder.group({
    correo: ['', [Validators.required, Validators.email, requiredTrimmed()]],
    password: ['', [Validators.required, requiredTrimmed()]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.loginSubmitted.emit({
      correo: raw.correo ?? '',
      password: raw.password ?? ''
    });
  }
}
