package com.dsw02.practica01.empleados.service;

import com.dsw02.practica01.common.exception.ResourceNotFoundException;
import com.dsw02.practica01.common.exception.ConflictException;
import com.dsw02.practica01.departamentos.domain.Departamento;
import com.dsw02.practica01.departamentos.repository.DepartamentoRepository;
import com.dsw02.practica01.empleados.domain.Empleado;
import com.dsw02.practica01.empleados.dto.CredencialEmpleadoRequest;
import com.dsw02.practica01.empleados.dto.EmpleadoRequest;
import com.dsw02.practica01.empleados.dto.EmpleadoResponse;
import com.dsw02.practica01.empleados.repository.EmpleadoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final DepartamentoRepository departamentoRepository;
    private final JdbcTemplate jdbcTemplate;

    public EmpleadoService(
            EmpleadoRepository empleadoRepository,
            DepartamentoRepository departamentoRepository,
            JdbcTemplate jdbcTemplate
    ) {
        this.empleadoRepository = empleadoRepository;
        this.departamentoRepository = departamentoRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public EmpleadoResponse create(EmpleadoRequest request) {
        Empleado empleado = new Empleado();
        empleado.setClave(nextClave());
        empleado.setNombre(normalize(request.nombre()));
        empleado.setDireccion(normalize(request.direccion()));
        empleado.setTelefono(normalize(request.telefono()));
        empleado.setDepartamento(resolveDepartamento(request.departamentoClave()));

        if (request.correo() != null && !request.correo().isBlank()) {
            String correo = normalizeEmail(request.correo());
            if (empleadoRepository.existsByCorreoIgnoreCase(correo)) {
                throw new ConflictException("El correo ya está registrado");
            }
            empleado.setCorreo(correo);
            if (request.password() != null && !request.password().isBlank()) {
                empleado.setPasswordHash(hashSha256(request.password()));
            }
        }

        Empleado created = empleadoRepository.save(empleado);
        return toResponse(created);
    }

    @Transactional(readOnly = true)
    public Page<EmpleadoResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return empleadoRepository.findAllOrderByClaveNumeric(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public EmpleadoResponse findByClave(String clave) {
        Empleado empleado = empleadoRepository.findById(clave)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado para clave: " + clave));
        return toResponse(empleado);
    }

    @Transactional
    public EmpleadoResponse update(String clave, EmpleadoRequest request) {
        Empleado empleado = empleadoRepository.findById(clave)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado para clave: " + clave));

        empleado.setNombre(normalize(request.nombre()));
        empleado.setDireccion(normalize(request.direccion()));
        empleado.setTelefono(normalize(request.telefono()));
        empleado.setDepartamento(resolveDepartamento(request.departamentoClave()));

        if (request.correo() != null && !request.correo().isBlank()) {
            String correo = normalizeEmail(request.correo());
            if (empleadoRepository.existsByCorreoIgnoreCaseAndClaveNot(correo, clave)) {
                throw new ConflictException("El correo ya está registrado por otro empleado");
            }
            empleado.setCorreo(correo);
        }

        if (request.password() != null && !request.password().isBlank()) {
            empleado.setPasswordHash(hashSha256(request.password()));
        }

        return toResponse(empleadoRepository.save(empleado));
    }

    @Transactional
    public EmpleadoResponse updateCredenciales(String clave, CredencialEmpleadoRequest request) {
        Empleado empleado = empleadoRepository.findById(clave)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado para clave: " + clave));

        String correo = normalizeEmail(request.correo());
        if (empleadoRepository.existsByCorreoIgnoreCaseAndClaveNot(correo, clave)) {
            throw new ConflictException("El correo ya está registrado por otro empleado");
        }

        empleado.setCorreo(correo);
        empleado.setPasswordHash(hashSha256(request.password()));

        return toResponse(empleadoRepository.save(empleado));
    }

    @Transactional
    public void delete(String clave) {
        if (!empleadoRepository.existsById(clave)) {
            throw new ResourceNotFoundException("Empleado no encontrado para clave: " + clave);
        }
        empleadoRepository.deleteById(clave);
    }

    private String nextClave() {
        Long next = jdbcTemplate.queryForObject("select nextval('empleados_seq')", Long.class);
        return "EMP-" + next;
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeEmail(String value) {
        return normalize(value).toLowerCase();
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

    private EmpleadoResponse toResponse(Empleado empleado) {
        return new EmpleadoResponse(
                empleado.getClave(),
                empleado.getNombre(),
                empleado.getDireccion(),
                empleado.getTelefono(),
                empleado.getCorreo(),
                empleado.getDepartamento() == null ? null : empleado.getDepartamento().getClave()
        );
    }

    private Departamento resolveDepartamento(String departamentoClave) {
        return departamentoRepository.findById(departamentoClave)
                .orElseThrow(() -> new ConflictException("departamentoClave no existe en catálogo de departamentos"));
    }
}
