package com.dsw02.practica01.empleados.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CredencialEmpleadoRequest(
        @NotBlank(message = "correo es obligatorio")
        @Email(message = "correo debe ser válido")
        @Size(max = 255, message = "correo debe tener máximo 255 caracteres")
        String correo,
        @NotBlank(message = "password es obligatorio")
        @Size(min = 8, max = 100, message = "password debe tener entre 8 y 100 caracteres")
        String password
) {
}
