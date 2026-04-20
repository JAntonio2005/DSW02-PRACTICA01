export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type?: string;
}

export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiErrorField {
  field: string;
  message: string;
}

export interface ApiErrorViewModel {
  status: number;
  message: string;
  fieldErrors?: ApiErrorField[];
  businessCode?: string;
}
