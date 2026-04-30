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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = EmpleadoController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class EmpleadoValidationIntegrationTest extends AbstractSecurityWebMvcIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmpleadoService empleadoService;

    @MockBean
    private JwtService jwtService;

    @Test
    void shouldReturnBadRequestWhenNombreExceedsMaxLength() throws Exception {
        mockValidJwt(jwtService);

        String longNombre = "A".repeat(101);
        String body = empleadoJsonWithNombre(longNombre);

        authorizedCreate(body)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.nombre").value(containsString("m\u00E1ximo 100")));
    }

    @Test
    void shouldReturnBadRequestWhenRequiredFieldIsBlank() throws Exception {
        mockValidJwt(jwtService);

        String body = empleadoJsonWithNombre(" ");

        authorizedCreate(body)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.nombre").value(containsString("obligatorio")));
    }

    private ResultActions authorizedCreate(String body) throws Exception {
        return mockMvc.perform(post("/api/v2/empleados")
                .header("Authorization", bearerToken())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body));
    }

    private String empleadoJsonWithNombre(String nombre) {
        return """
                {
                  "nombre": "%s",
                  "direccion": "Av 1",
                  "telefono": "5551234",
                  "departamentoClave": "DEP-1"
                }
                """.formatted(nombre);
    }
}
