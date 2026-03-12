package com.dsw02.practica01.empleados.service;

import com.dsw02.practica01.common.exception.InvalidCredentialsException;
import com.dsw02.practica01.common.security.JwtService;
import com.dsw02.practica01.empleados.domain.Empleado;
import com.dsw02.practica01.empleados.domain.EventoAutenticacion;
import com.dsw02.practica01.empleados.dto.LoginRequest;
import com.dsw02.practica01.empleados.dto.LoginResponse;
import com.dsw02.practica01.empleados.repository.EmpleadoRepository;
import com.dsw02.practica01.empleados.repository.EventoAutenticacionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;

@Service
public class AuthService {

    private final EmpleadoRepository empleadoRepository;
    private final EventoAutenticacionRepository eventoAutenticacionRepository;
    private final JwtService jwtService;

    public AuthService(
            EmpleadoRepository empleadoRepository,
            EventoAutenticacionRepository eventoAutenticacionRepository,
            JwtService jwtService
    ) {
        this.empleadoRepository = empleadoRepository;
        this.eventoAutenticacionRepository = eventoAutenticacionRepository;
        this.jwtService = jwtService;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Empleado empleado = empleadoRepository.findByCorreoIgnoreCase(request.correo())
                .orElseThrow(() -> {
                    registrarEvento(null, request.correo(), false, "correo no encontrado");
                    return new InvalidCredentialsException("Credenciales inválidas");
                });

        if (empleado.getPasswordHash() == null) {
            registrarEvento(empleado.getClave(), request.correo(), false, "credenciales no configuradas");
            throw new InvalidCredentialsException("Credenciales inválidas");
        }

        String expectedHash = hashSha256(request.password());
        if (!expectedHash.equals(empleado.getPasswordHash())) {
            registrarEvento(empleado.getClave(), request.correo(), false, "password incorrecto");
            throw new InvalidCredentialsException("Credenciales inválidas");
        }

        String token = jwtService.generateToken(empleado);
        registrarEvento(empleado.getClave(), request.correo(), true, "login exitoso");

        return new LoginResponse(token, jwtService.getExpirationSeconds());
    }

    public void registrarIntentoFallidoSinBloqueo(String clave, String correo, String detalle) {
        registrarEvento(clave, correo, false, detalle);
    }

    private void registrarEvento(String clave, String correo, boolean exitoso, String detalle) {
        EventoAutenticacion evento = new EventoAutenticacion();
        evento.setClaveEmpleado(clave);
        evento.setCorreo(correo == null ? null : correo.toLowerCase());
        evento.setExitoso(exitoso);
        evento.setDetalle(detalle);
        evento.setFechaHora(Instant.now());
        eventoAutenticacionRepository.save(evento);
    }

    private String hashSha256(String plain) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(plain.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder();
            for (byte b : hash) {
                builder.append(String.format("%02x", b));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 no disponible", e);
        }
    }
}
