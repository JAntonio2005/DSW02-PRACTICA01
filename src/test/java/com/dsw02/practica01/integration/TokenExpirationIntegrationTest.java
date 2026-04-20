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
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = EmpleadoController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class TokenExpirationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmpleadoService empleadoService;

    @MockBean
    private JwtService jwtService;

    @Test
    void shouldRejectExpiredToken() throws Exception {
        when(jwtService.extractSubject("expired-token")).thenReturn("EMP-1");
        when(jwtService.isTokenValid("expired-token")).thenReturn(false);

        mockMvc.perform(get("/api/v2/empleados")
                        .header("Authorization", "Bearer expired-token"))
                .andExpect(status().isUnauthorized());
    }
}
