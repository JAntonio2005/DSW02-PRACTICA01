package com.dsw02.practica01.unit.security;

import com.dsw02.practica01.common.security.JwtProperties;
import com.dsw02.practica01.common.security.JwtService;
import com.dsw02.practica01.empleados.domain.Empleado;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    @Test
    void shouldGenerateAndValidateToken() {
        JwtService jwtService = new JwtService(jwtProperties("0123456789ABCDEF0123456789ABCDEF", 60));

        String token = jwtService.generateToken(empleado("EMP-10", "empleado@correo.com"));

        assertThat(token).isNotBlank();
        assertThat(jwtService.extractSubject(token)).isEqualTo("EMP-10");
        assertThat(jwtService.isTokenValid(token)).isTrue();
        assertThat(jwtService.getExpirationSeconds()).isEqualTo(3600);
    }

    @Test
    void shouldReturnExpiredTokenAsInvalid() {
        JwtService jwtService = new JwtService(jwtProperties("0123456789ABCDEF0123456789ABCDEF", -1));

        String token = jwtService.generateToken(empleado("EMP-11", "expirado@correo.com"));

        assertThat(jwtService.isTokenValid(token)).isFalse();
    }

    @Test
    void shouldFailWhenTokenIsTampered() {
        JwtService jwtService = new JwtService(jwtProperties("0123456789ABCDEF0123456789ABCDEF", 60));

        String token = jwtService.generateToken(empleado("EMP-12", "tamper@correo.com"));
        String tamperedToken = token + "x";

        assertThatThrownBy(() -> jwtService.extractSubject(tamperedToken))
                .isInstanceOf(Exception.class);
    }

    private JwtProperties jwtProperties(String secret, long expirationMinutes) {
        JwtProperties properties = new JwtProperties();
        properties.setSecret(secret);
        properties.setExpirationMinutes(expirationMinutes);
        return properties;
    }

    private Empleado empleado(String clave, String correo) {
        Empleado empleado = new Empleado();
        empleado.setClave(clave);
        empleado.setCorreo(correo);
        return empleado;
    }
}
