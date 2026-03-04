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
import org.springframework.data.domain.Page;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = EmpleadoController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
@TestPropertySource(properties = {
        "app.security.admin-user=admin",
        "app.security.admin-password=admin123",
        "app.security.admin-role=ADMIN"
})
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmpleadoService empleadoService;

    @Test
    void shouldRejectRequestWithoutCredentials() throws Exception {
        mockMvc.perform(get("/api/v2/empleados"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldAllowRequestWithValidCredentials() throws Exception {
        when(empleadoService.findAll(0, 10)).thenReturn(Page.empty());

        mockMvc.perform(get("/api/v2/empleados")
                        .with(httpBasic("admin", "admin123")))
                .andExpect(status().isOk());
    }
}
