package com.dsw02.practica01.integration;

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
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = EmpleadoController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
@TestPropertySource(properties = {
        "app.security.admin-user=admin",
        "app.security.admin-password=admin123",
        "app.security.admin-role=ADMIN"
})
class EmpleadoValidationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmpleadoService empleadoService;

        @MockBean
        private JwtService jwtService;

    @Test
    void shouldReturnBadRequestWhenNombreExceedsMaxLength() throws Exception {
                when(jwtService.extractSubject("valid-token")).thenReturn("EMP-1");
                when(jwtService.isTokenValid("valid-token")).thenReturn(true);

        String longNombre = "A".repeat(101);
        String body = """
                {
                  \"nombre\": \"%s\",
                  \"direccion\": \"Av 1\",
                                                                        \"telefono\": \"5551234\",
                                                                        \"departamentoClave\": \"DEP-1\"
                }
                """.formatted(longNombre);

        mockMvc.perform(post("/api/v2/empleados")
                        .header("Authorization", "Bearer valid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.nombre").value(containsString("máximo 100")));
    }

    @Test
    void shouldReturnBadRequestWhenRequiredFieldIsBlank() throws Exception {
        when(jwtService.extractSubject("valid-token")).thenReturn("EMP-1");
        when(jwtService.isTokenValid("valid-token")).thenReturn(true);

        String body = """
                {
                  \"nombre\": \" \" ,
                  \"direccion\": \"Av 1\",
                                                                        \"telefono\": \"5551234\",
                                                                        \"departamentoClave\": \"DEP-1\"
                }
                """;

        mockMvc.perform(post("/api/v2/empleados")
                        .header("Authorization", "Bearer valid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.nombre").value(containsString("obligatorio")));
    }
}
