export const selectors = {
  auth: {
    correoInput: 'input[formControlName="correo"]',
    passwordInput: 'input[formControlName="password"]',
    submitButton: 'button[type="submit"]'
  },
  common: {
    errorBanner: 'app-api-error-banner section[role="alert"]',
    pageTitle: 'section.page-shell h1'
  },
  departamentos: {
    claveInput: 'input[formControlName="clave"]',
    nombreInput: 'input[formControlName="nombre"]'
  },
  empleados: {
    claveInput: 'input[formControlName="clave"]',
    nombreInput: 'input[formControlName="nombre"]',
    direccionInput: 'input[formControlName="direccion"]',
    telefonoInput: 'input[formControlName="telefono"]',
    departamentoClaveInput: 'input[formControlName="departamentoClave"]'
  }
} as const;
