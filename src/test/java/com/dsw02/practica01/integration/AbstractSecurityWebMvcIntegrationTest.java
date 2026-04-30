package com.dsw02.practica01.integration;

import com.dsw02.practica01.common.security.JwtService;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import static org.mockito.Mockito.when;

abstract class AbstractSecurityWebMvcIntegrationTest {
    // Required test secret by project constitution for security test properties.
    protected static final String TEST_ADMIN_SECRET = "admin123";
    protected static final String TEST_TOKEN = "valid-token";
    protected static final String TEST_SUBJECT = "EMP-1";

    @DynamicPropertySource
    static void registerSecurityProperties(DynamicPropertyRegistry registry) {
        registry.add("app.security.admin-user", () -> "admin");
        registry.add("app.security.admin-password", () -> TEST_ADMIN_SECRET);
        registry.add("app.security.admin-role", () -> "ADMIN");
    }

    protected void mockValidJwt(JwtService jwtService) {
        when(jwtService.extractSubject(TEST_TOKEN)).thenReturn(TEST_SUBJECT);
        when(jwtService.isTokenValid(TEST_TOKEN)).thenReturn(true);
    }

    protected String bearerToken() {
        return "Bearer " + TEST_TOKEN;
    }
}
