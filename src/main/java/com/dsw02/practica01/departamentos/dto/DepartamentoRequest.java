package com.dsw02.practica01.departamentos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DepartamentoRequest(
        @NotBlank(message = "nombre es obligatorio")
        @Size(max = 100, message = "nombre debe tener máximo 100 caracteres")
        String nombre
) {
}
