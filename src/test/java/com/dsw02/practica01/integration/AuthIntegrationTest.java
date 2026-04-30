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
import org.springframework.data.domain.Page;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = EmpleadoController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class AuthIntegrationTest {
    // Required test secret by project constitution for security test properties.
    private static final String TEST_ADMIN_SECRET = "admin123";
    private static final String TEST_TOKEN = "valid-token";
    private static final String TEST_SUBJECT = "EMP-1";

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmpleadoService empleadoService;

    @MockBean
    private JwtService jwtService;

    @DynamicPropertySource
    static void registerSecurityProperties(DynamicPropertyRegistry registry) {
        registry.add("app.security.admin-user", () -> "admin");
        registry.add("app.security.admin-password", () -> TEST_ADMIN_SECRET);
        registry.add("app.security.admin-role", () -> "ADMIN");
    }

    @Test
    void shouldRejectRequestWithoutCredentials() throws Exception {
        mockMvc.perform(get("/api/v2/empleados"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldAllowRequestWithValidJwtToken() throws Exception {
        when(empleadoService.findAll(0, 10)).thenReturn(Page.empty());
        mockValidJwt();

        authorizedEmpleadosGet()
                .andExpect(status().isOk());
    }

    private void mockValidJwt() {
        when(jwtService.extractSubject(TEST_TOKEN)).thenReturn(TEST_SUBJECT);
        when(jwtService.isTokenValid(TEST_TOKEN)).thenReturn(true);
    }

    private ResultActions authorizedEmpleadosGet() throws Exception {
        return mockMvc.perform(get("/api/v2/empleados")
                .header("Authorization", "Bearer " + TEST_TOKEN));
    }

}
