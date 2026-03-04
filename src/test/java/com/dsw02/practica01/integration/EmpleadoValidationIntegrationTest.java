package com.dsw02.practica01.integration;

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
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
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

    @Test
    void shouldReturnBadRequestWhenNombreExceedsMaxLength() throws Exception {
        String longNombre = "A".repeat(101);
        String body = """
                {
                  \"nombre\": \"%s\",
                  \"direccion\": \"Av 1\",
                  \"telefono\": \"5551234\"
                }
                """.formatted(longNombre);

        mockMvc.perform(post("/api/v2/empleados")
                        .with(httpBasic("admin", "admin123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.nombre").value(containsString("máximo 100")));
    }

    @Test
    void shouldReturnBadRequestWhenRequiredFieldIsBlank() throws Exception {
        String body = """
                {
                  \"nombre\": \" \" ,
                  \"direccion\": \"Av 1\",
                  \"telefono\": \"5551234\"
                }
                """;

        mockMvc.perform(post("/api/v2/empleados")
                        .with(httpBasic("admin", "admin123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.nombre").value(containsString("obligatorio")));
    }
}
