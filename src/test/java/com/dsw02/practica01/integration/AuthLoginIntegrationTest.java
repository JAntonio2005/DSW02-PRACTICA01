package com.dsw02.practica01.integration;

import com.dsw02.practica01.common.exception.InvalidCredentialsException;
import com.dsw02.practica01.common.security.JwtService;
import com.dsw02.practica01.common.security.SecurityConfig;
import com.dsw02.practica01.common.web.GlobalExceptionHandler;
import com.dsw02.practica01.empleados.dto.LoginRequest;
import com.dsw02.practica01.empleados.dto.LoginResponse;
import com.dsw02.practica01.empleados.service.AuthService;
import com.dsw02.practica01.empleados.web.AuthController;
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

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class AuthLoginIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @Test
    void shouldLoginSuccessfullyWithValidCredentials() throws Exception {
        when(authService.login(any(LoginRequest.class))).thenReturn(new LoginResponse("jwt-token", 3600));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"correo\": \"empleado@correo.com\",
                                  \"password\": \"Password123\"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.expiresInSeconds").value(3600));
    }

    @Test
    void shouldReturnInvalidCredentialsErrorCode() throws Exception {
        when(authService.login(any(LoginRequest.class))).thenThrow(new InvalidCredentialsException("Credenciales inválidas"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"correo\": \"empleado@correo.com\",
                                  \"password\": \"incorrecta\"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH_INVALID_CREDENTIALS"));
    }

    @Test
    void shouldReturnValidationErrorCodeForInvalidPayload() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"correo\": \"bad-format\",
                                  \"password\": \"\"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("AUTH_VALIDATION_ERROR"));
    }
}
