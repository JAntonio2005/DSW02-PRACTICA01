package com.dsw02.practica01.integration;

import com.dsw02.practica01.common.security.JwtService;
import com.dsw02.practica01.common.security.SecurityConfig;
import com.dsw02.practica01.common.web.GlobalExceptionHandler;
import com.dsw02.practica01.departamentos.dto.DepartamentoResponse;
import com.dsw02.practica01.departamentos.service.DepartamentoService;
import com.dsw02.practica01.departamentos.web.DepartamentoController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DepartamentoController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class DepartamentoCrudIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DepartamentoService departamentoService;

    @MockBean
    private JwtService jwtService;

    @Test
    void shouldCreateAndListDepartamentosWithPagination() throws Exception {
        when(jwtService.extractSubject("valid-token")).thenReturn("EMP-1");
        when(jwtService.isTokenValid("valid-token")).thenReturn(true);

        when(departamentoService.create(any())).thenReturn(new DepartamentoResponse("DEP-1", "Recursos Humanos"));

        Page<DepartamentoResponse> page = new PageImpl<>(List.of(
                new DepartamentoResponse("DEP-1", "Recursos Humanos")
        ));
        when(departamentoService.findAll(0, 10)).thenReturn(page);

        mockMvc.perform(post("/api/v2/departamentos")
                        .header("Authorization", "Bearer valid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"nombre\": \"Recursos Humanos\"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.clave").value("DEP-1"))
                .andExpect(jsonPath("$.nombre").value("Recursos Humanos"));

        mockMvc.perform(get("/api/v2/departamentos")
                        .param("page", "0")
                        .param("size", "10")
                        .header("Authorization", "Bearer valid-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].clave").value("DEP-1"));
    }

    @Test
    void shouldGetAndUpdateDepartamentoByClave() throws Exception {
        when(jwtService.extractSubject("valid-token")).thenReturn("EMP-1");
        when(jwtService.isTokenValid("valid-token")).thenReturn(true);

        when(departamentoService.findByClave("DEP-1")).thenReturn(new DepartamentoResponse("DEP-1", "Recursos Humanos"));
        when(departamentoService.update(eq("DEP-1"), any())).thenReturn(new DepartamentoResponse("DEP-1", "Finanzas"));

        mockMvc.perform(get("/api/v2/departamentos/DEP-1")
                        .header("Authorization", "Bearer valid-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clave").value("DEP-1"))
                .andExpect(jsonPath("$.nombre").value("Recursos Humanos"));

        mockMvc.perform(put("/api/v2/departamentos/DEP-1")
                        .header("Authorization", "Bearer valid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  \"nombre\": \"Finanzas\"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Finanzas"));
    }
}
