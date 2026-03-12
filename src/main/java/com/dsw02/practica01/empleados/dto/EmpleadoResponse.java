package com.dsw02.practica01.empleados.dto;

public record EmpleadoResponse(
        String clave,
        String nombre,
        String direccion,
        String telefono,
        String correo
) {
}
