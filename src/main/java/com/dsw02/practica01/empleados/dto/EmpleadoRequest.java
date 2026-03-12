package com.dsw02.practica01.empleados.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record EmpleadoRequest(
        @NotBlank(message = "nombre es obligatorio")
        @Size(max = 100, message = "nombre debe tener máximo 100 caracteres")
        String nombre,
        @NotBlank(message = "direccion es obligatoria")
        @Size(max = 100, message = "direccion debe tener máximo 100 caracteres")
        String direccion,
        @NotBlank(message = "telefono es obligatorio")
        @Size(max = 100, message = "telefono debe tener máximo 100 caracteres")
        String telefono,
        @Email(message = "correo debe ser válido")
        @Size(max = 255, message = "correo debe tener máximo 255 caracteres")
        String correo,
        @Size(min = 8, max = 100, message = "password debe tener entre 8 y 100 caracteres")
        String password
) {
}
