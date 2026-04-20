package com.dsw02.practica01.departamentos.service;

import com.dsw02.practica01.common.exception.ConflictException;
import com.dsw02.practica01.common.exception.ResourceNotFoundException;
import com.dsw02.practica01.departamentos.domain.Departamento;
import com.dsw02.practica01.departamentos.dto.DepartamentoRequest;
import com.dsw02.practica01.departamentos.dto.DepartamentoResponse;
import com.dsw02.practica01.departamentos.repository.DepartamentoRepository;
import com.dsw02.practica01.empleados.repository.EmpleadoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DepartamentoService {

    private final DepartamentoRepository departamentoRepository;
    private final EmpleadoRepository empleadoRepository;
    private final JdbcTemplate jdbcTemplate;

    public DepartamentoService(
            DepartamentoRepository departamentoRepository,
            EmpleadoRepository empleadoRepository,
            JdbcTemplate jdbcTemplate
    ) {
        this.departamentoRepository = departamentoRepository;
        this.empleadoRepository = empleadoRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public DepartamentoResponse create(DepartamentoRequest request) {
        String nombre = normalize(request.nombre());
        if (departamentoRepository.existsByNombreIgnoreCase(nombre)) {
            throw new ConflictException("Ya existe un departamento con ese nombre");
        }

        Departamento departamento = new Departamento();
        departamento.setClave(nextClave());
        departamento.setNombre(nombre);

        return toResponse(departamentoRepository.save(departamento));
    }

    @Transactional(readOnly = true)
    public Page<DepartamentoResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return departamentoRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public DepartamentoResponse findByClave(String clave) {
        Departamento departamento = departamentoRepository.findById(clave)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado para clave: " + clave));
        return toResponse(departamento);
    }

    @Transactional
    public DepartamentoResponse update(String clave, DepartamentoRequest request) {
        Departamento departamento = departamentoRepository.findById(clave)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado para clave: " + clave));

        String nombre = normalize(request.nombre());
        if (departamentoRepository.existsByNombreIgnoreCaseAndClaveNot(nombre, clave)) {
            throw new ConflictException("Ya existe un departamento con ese nombre");
        }

        departamento.setNombre(nombre);
        return toResponse(departamentoRepository.save(departamento));
    }

    @Transactional
    public void delete(String clave) {
        Departamento departamento = departamentoRepository.findById(clave)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado para clave: " + clave));

        if (empleadoRepository.existsByDepartamento_Clave(departamento.getClave())) {
            throw new ConflictException("No se puede eliminar el departamento porque tiene empleados asociados");
        }

        departamentoRepository.delete(departamento);
    }

    private String nextClave() {
        Long next = jdbcTemplate.queryForObject("select nextval('departamentos_seq')", Long.class);
        return "DEP-" + next;
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private DepartamentoResponse toResponse(Departamento departamento) {
        return new DepartamentoResponse(departamento.getClave(), departamento.getNombre());
    }
}
