package com.dsw02.practica01.integration;

import com.dsw02.practica01.common.exception.ConflictException;
import com.dsw02.practica01.common.security.JwtService;
import com.dsw02.practica01.common.security.SecurityConfig;
import com.dsw02.practica01.common.web.GlobalExceptionHandler;
import com.dsw02.practica01.empleados.service.EmpleadoService;
import com.dsw02.practica01.empleados.web.EmpleadoController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = EmpleadoController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class EmpleadoDepartamentoValidationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmpleadoService empleadoService;

    @MockBean
    private JwtService jwtService;

    @Test
    void shouldReturnBadRequestWhenDepartamentoClaveIsMissing() throws Exception {
        when(jwtService.extractSubject("valid-token")).thenReturn("EMP-1");
        when(jwtService.isTokenValid("valid-token")).thenReturn(true);

        mockMvc.perform(post("/api/v2/empleados")
                        .header("Authorization", "Bearer valid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"nombre\": \"Juan\",
                                  \"direccion\": \"Centro\",
                                  \"telefono\": \"9991112233\"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.departamentoClave").value(containsString("obligatorio")));
    }

    @Test
    void shouldReturnConflictWhenDepartamentoClaveDoesNotExist() throws Exception {
        when(jwtService.extractSubject("valid-token")).thenReturn("EMP-1");
        when(jwtService.isTokenValid("valid-token")).thenReturn(true);
        when(empleadoService.create(any()))
                .thenThrow(new ConflictException("departamentoClave no existe en catálogo de departamentos"));
        when(empleadoService.update(any(), any()))
                .thenThrow(new ConflictException("departamentoClave no existe en catálogo de departamentos"));

        String body = """
                {
                  \"nombre\": \"Juan\",
                  \"direccion\": \"Centro\",
                  \"telefono\": \"9991112233\",
                  \"departamentoClave\": \"DEP-404\"
                }
                """;

        mockMvc.perform(post("/api/v2/empleados")
                        .header("Authorization", "Bearer valid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("BUSINESS_VALIDATION_ERROR"));

        mockMvc.perform(put("/api/v2/empleados/EMP-1")
                        .header("Authorization", "Bearer valid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("BUSINESS_VALIDATION_ERROR"));
    }
}
