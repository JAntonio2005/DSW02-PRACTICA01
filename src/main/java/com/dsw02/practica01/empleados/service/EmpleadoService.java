package com.dsw02.practica01.empleados.service;

import com.dsw02.practica01.common.exception.ResourceNotFoundException;
import com.dsw02.practica01.empleados.domain.Empleado;
import com.dsw02.practica01.empleados.dto.EmpleadoRequest;
import com.dsw02.practica01.empleados.dto.EmpleadoResponse;
import com.dsw02.practica01.empleados.repository.EmpleadoRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final JdbcTemplate jdbcTemplate;

    public EmpleadoService(EmpleadoRepository empleadoRepository, JdbcTemplate jdbcTemplate) {
        this.empleadoRepository = empleadoRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public EmpleadoResponse create(EmpleadoRequest request) {
        Empleado empleado = new Empleado();
        empleado.setClave(nextClave());
        empleado.setNombre(normalize(request.nombre()));
        empleado.setDireccion(normalize(request.direccion()));
        empleado.setTelefono(normalize(request.telefono()));

        Empleado created = empleadoRepository.save(empleado);
        return toResponse(created);
    }

    @Transactional(readOnly = true)
    public List<EmpleadoResponse> findAll() {
        return empleadoRepository.findAll().stream().map(this::toResponse).toList();
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

    private EmpleadoResponse toResponse(Empleado empleado) {
        return new EmpleadoResponse(
                empleado.getClave(),
                empleado.getNombre(),
                empleado.getDireccion(),
                empleado.getTelefono()
        );
    }
}
