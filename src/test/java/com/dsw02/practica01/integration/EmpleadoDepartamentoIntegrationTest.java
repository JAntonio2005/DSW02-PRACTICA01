package com.dsw02.practica01.integration;

import com.dsw02.practica01.common.security.JwtService;
import com.dsw02.practica01.common.security.SecurityConfig;
import com.dsw02.practica01.common.web.GlobalExceptionHandler;
import com.dsw02.practica01.empleados.dto.EmpleadoResponse;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = EmpleadoController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class EmpleadoDepartamentoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmpleadoService empleadoService;

    @MockBean
    private JwtService jwtService;

    @Test
    void shouldCreateEmpleadoWhenDepartamentoClaveIsValid() throws Exception {
        when(jwtService.extractSubject("valid-token")).thenReturn("EMP-1");
        when(jwtService.isTokenValid("valid-token")).thenReturn(true);

        when(empleadoService.create(any())).thenReturn(new EmpleadoResponse(
                "EMP-2",
                "Juan",
                "Centro",
                "9991112233",
                "juan@empresa.com",
                "DEP-1"
        ));

        mockMvc.perform(post("/api/v2/empleados")
                        .header("Authorization", "Bearer valid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"nombre\": \"Juan\",
                                  \"direccion\": \"Centro\",
                                  \"telefono\": \"9991112233\",
                                  \"correo\": \"juan@empresa.com\",
                                  \"password\": \"admin12345\",
                                  \"departamentoClave\": \"DEP-1\"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.clave").value("EMP-2"))
                .andExpect(jsonPath("$.departamentoClave").value("DEP-1"));
    }
}
