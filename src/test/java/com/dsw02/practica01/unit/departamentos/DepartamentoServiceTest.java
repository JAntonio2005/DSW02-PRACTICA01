package com.dsw02.practica01.unit.departamentos;

import com.dsw02.practica01.common.exception.ConflictException;
import com.dsw02.practica01.departamentos.domain.Departamento;
import com.dsw02.practica01.departamentos.dto.DepartamentoRequest;
import com.dsw02.practica01.departamentos.dto.DepartamentoResponse;
import com.dsw02.practica01.departamentos.repository.DepartamentoRepository;
import com.dsw02.practica01.departamentos.service.DepartamentoService;
import com.dsw02.practica01.empleados.repository.EmpleadoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DepartamentoServiceTest {

    @Mock
    private DepartamentoRepository departamentoRepository;

    @Mock
    private EmpleadoRepository empleadoRepository;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private DepartamentoService departamentoService;

    private DepartamentoRequest request;

    @BeforeEach
    void setUp() {
        request = new DepartamentoRequest("Recursos Humanos");
    }

    @Test
    void shouldCreateDepartamentoWhenNameIsUnique() {
        when(departamentoRepository.existsByNombreIgnoreCase("Recursos Humanos")).thenReturn(false);
        when(jdbcTemplate.queryForObject("select nextval('departamentos_seq')", Long.class)).thenReturn(1L);
        when(departamentoRepository.save(any(Departamento.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DepartamentoResponse response = departamentoService.create(request);

        assertThat(response.clave()).isEqualTo("DEP-1");
        assertThat(response.nombre()).isEqualTo("Recursos Humanos");
    }

    @Test
    void shouldFailCreateWhenNombreAlreadyExists() {
        when(departamentoRepository.existsByNombreIgnoreCase("Recursos Humanos")).thenReturn(true);

        assertThatThrownBy(() -> departamentoService.create(request))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("Ya existe un departamento");
    }

    @Test
    void shouldFailDeleteWhenDepartamentoHasEmpleados() {
        Departamento departamento = new Departamento();
        departamento.setClave("DEP-1");
        departamento.setNombre("Recursos Humanos");

        when(departamentoRepository.findById("DEP-1")).thenReturn(java.util.Optional.of(departamento));
        when(empleadoRepository.existsByDepartamento_Clave(eq("DEP-1"))).thenReturn(true);

        assertThatThrownBy(() -> departamentoService.delete("DEP-1"))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("empleados asociados");
    }
}
