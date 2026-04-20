import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiErrorField, ApiErrorViewModel } from './api.models';

@Injectable({ providedIn: 'root' })
export class ApiErrorMapper {
  toViewModel(error: HttpErrorResponse): ApiErrorViewModel {
    const payload = this.getPayload(error);
    const fieldErrors = this.mapFieldErrors(payload);

    return {
      status: error.status,
      message: this.mapMessage(error.status, payload),
      fieldErrors,
      businessCode: this.readString(payload, 'code')
    };
  }

  private mapMessage(status: number, payload: unknown): string {
    const backendMessage = this.readString(payload, 'message');
    if (backendMessage) {
      return backendMessage;
    }

    if (status === 400) {
      return 'La solicitud contiene datos inválidos.';
    }

    if (status === 401) {
      return 'Tu sesión expiró o no es válida. Inicia sesión nuevamente.';
    }

    if (status === 409) {
      return 'No fue posible completar la operación por un conflicto de negocio.';
    }

    return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }

  private mapFieldErrors(payload: unknown): ApiErrorField[] | undefined {
    const errors = this.readObject(payload, 'fieldErrors');
    if (!errors) {
      return undefined;
    }

    return Object.entries(errors)
      .filter(([, value]) => typeof value === 'string')
      .map(([field, message]) => ({
        field,
        message: String(message)
      }));
  }

  private getPayload(error: HttpErrorResponse): unknown {
    if (error.error && typeof error.error === 'object') {
      return error.error;
    }
    return undefined;
  }

  private readObject(payload: unknown, key: string): Record<string, unknown> | undefined {
    if (!payload || typeof payload !== 'object') {
      return undefined;
    }
    const value = (payload as Record<string, unknown>)[key];
    if (!value || typeof value !== 'object') {
      return undefined;
    }
    return value as Record<string, unknown>;
  }

  private readString(payload: unknown, key: string): string | undefined {
    if (!payload || typeof payload !== 'object') {
      return undefined;
    }
    const value = (payload as Record<string, unknown>)[key];
    return typeof value === 'string' ? value : undefined;
  }
}
