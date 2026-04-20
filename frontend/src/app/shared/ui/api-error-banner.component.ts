import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiErrorViewModel } from '../../core/http/api.models';

@Component({
  selector: 'app-api-error-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section *ngIf="error" class="error-banner" role="alert">
      <strong>Error {{ error.status }}:</strong> {{ error.message }}
      <ul *ngIf="error.fieldErrors?.length">
        <li *ngFor="let fieldError of error.fieldErrors">
          {{ fieldError.field }}: {{ fieldError.message }}
        </li>
      </ul>
    </section>
  `,
  styles: [
    `
      .error-banner {
        border: 1px solid var(--hb-danger-border);
        background: var(--hb-danger-bg);
        color: var(--hb-danger-text);
        padding: 12px 14px;
        border-radius: 12px;
        margin-bottom: 14px;
        backdrop-filter: blur(5px);
      }

      strong {
        font-family: 'Sora', 'Segoe UI', sans-serif;
      }

      ul {
        margin: 8px 0 0;
        padding-left: 20px;
      }
    `
  ]
})
export class ApiErrorBannerComponent {
  @Input() error: ApiErrorViewModel | null = null;
}
