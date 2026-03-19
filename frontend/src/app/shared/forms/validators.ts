import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function requiredTrimmed(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (typeof value !== 'string') {
      return null;
    }
    return value.trim().length === 0 ? { requiredTrimmed: true } : null;
  };
}

export function requiredDepartamentoClave(): ValidatorFn {
  return requiredTrimmed();
}
