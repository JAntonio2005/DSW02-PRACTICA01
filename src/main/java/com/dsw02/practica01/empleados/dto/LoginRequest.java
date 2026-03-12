package com.dsw02.practica01.empleados.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "correo es obligatorio")
        @Email(message = "correo debe ser válido")
        String correo,
        @NotBlank(message = "password es obligatorio")
        String password
) {
}
