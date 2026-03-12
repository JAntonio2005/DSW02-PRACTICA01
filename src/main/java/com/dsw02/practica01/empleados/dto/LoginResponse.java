package com.dsw02.practica01.empleados.dto;

public record LoginResponse(
        String token,
        long expiresInSeconds
) {
}
