import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="pagination" *ngIf="totalPages > 0">
      <button type="button" (click)="previous()" [disabled]="page <= 0">Anterior</button>
      <span>Página {{ page + 1 }} de {{ totalPages }}</span>
      <button type="button" (click)="next()" [disabled]="page >= totalPages - 1">Siguiente</button>
    </nav>
  `,
  styles: [
    `
      .pagination {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-top: 12px;
      }
      button {
        padding: 6px 10px;
      }
    `
  ]
})
export class PaginationComponent {
  @Input() page = 0;
  @Input() totalPages = 0;
  @Output() pageChange = new EventEmitter<number>();

  previous(): void {
    if (this.page > 0) {
      this.pageChange.emit(this.page - 1);
    }
  }

  next(): void {
    if (this.page < this.totalPages - 1) {
      this.pageChange.emit(this.page + 1);
    }
  }
}
