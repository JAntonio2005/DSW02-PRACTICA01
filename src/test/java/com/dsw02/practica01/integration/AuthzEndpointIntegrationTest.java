package com.dsw02.practica01.integration;

import com.dsw02.practica01.common.security.JwtService;
import com.dsw02.practica01.common.security.SecurityConfig;
import com.dsw02.practica01.common.web.GlobalExceptionHandler;
import com.dsw02.practica01.empleados.service.AuthService;
import com.dsw02.practica01.empleados.service.EmpleadoService;
import com.dsw02.practica01.empleados.web.AuthController;
import com.dsw02.practica01.empleados.web.EmpleadoController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {EmpleadoController.class, AuthController.class})
@AutoConfigureMockMvc
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class AuthzEndpointIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmpleadoService empleadoService;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @Test
    void shouldRejectProtectedEndpointWithoutToken() throws Exception {
        mockMvc.perform(get("/api/v2/empleados"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldAllowProtectedEndpointWithValidToken() throws Exception {
        when(jwtService.extractSubject("valid-token")).thenReturn("EMP-1");
        when(jwtService.isTokenValid("valid-token")).thenReturn(true);
        when(empleadoService.findAll(0, 10)).thenReturn(Page.empty());

        mockMvc.perform(get("/api/v2/empleados")
                        .header("Authorization", "Bearer valid-token"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldKeepLoginPublic() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"correo\": \"bad\",
                                  \"password\": \"\"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }
}
