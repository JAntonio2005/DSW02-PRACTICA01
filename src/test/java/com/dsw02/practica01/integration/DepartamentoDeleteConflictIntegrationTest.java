package com.dsw02.practica01.integration;

import com.dsw02.practica01.common.exception.ConflictException;
import com.dsw02.practica01.common.security.JwtService;
import com.dsw02.practica01.common.security.SecurityConfig;
import com.dsw02.practica01.common.web.GlobalExceptionHandler;
import com.dsw02.practica01.departamentos.service.DepartamentoService;
import com.dsw02.practica01.departamentos.web.DepartamentoController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DepartamentoController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class DepartamentoDeleteConflictIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DepartamentoService departamentoService;

    @MockBean
    private JwtService jwtService;

    @Test
    void shouldReturnConflictWhenDeletingDepartamentoWithAssociatedEmpleados() throws Exception {
        when(jwtService.extractSubject("valid-token")).thenReturn("EMP-1");
        when(jwtService.isTokenValid("valid-token")).thenReturn(true);

        doThrow(new ConflictException("No se puede eliminar el departamento porque tiene empleados asociados"))
                .when(departamentoService).delete("DEP-1");

        mockMvc.perform(delete("/api/v2/departamentos/DEP-1")
                        .header("Authorization", "Bearer valid-token"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("CONFLICT"));
    }
}
