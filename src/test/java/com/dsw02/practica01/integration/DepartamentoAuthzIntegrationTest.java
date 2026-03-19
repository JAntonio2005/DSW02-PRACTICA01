package com.dsw02.practica01.integration;

import com.dsw02.practica01.common.security.JwtService;
import com.dsw02.practica01.common.security.SecurityConfig;
import com.dsw02.practica01.common.web.GlobalExceptionHandler;
import com.dsw02.practica01.departamentos.service.DepartamentoService;
import com.dsw02.practica01.departamentos.web.DepartamentoController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DepartamentoController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class DepartamentoAuthzIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DepartamentoService departamentoService;

    @MockBean
    private JwtService jwtService;

    @Test
    void shouldRejectDepartamentosEndpointWithoutToken() throws Exception {
        mockMvc.perform(get("/api/v2/departamentos"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldAllowDepartamentosEndpointWithValidToken() throws Exception {
        when(jwtService.extractSubject("valid-token")).thenReturn("EMP-1");
        when(jwtService.isTokenValid("valid-token")).thenReturn(true);
        when(departamentoService.findAll(0, 10)).thenReturn(Page.empty());

        mockMvc.perform(get("/api/v2/departamentos")
                        .header("Authorization", "Bearer valid-token"))
                .andExpect(status().isOk());
    }
}
