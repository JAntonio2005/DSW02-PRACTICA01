package com.dsw02.practica01.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
class PersistenceIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("empleadosdb")
            .withUsername("postgres")
            .withPassword("postgres");

    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("app.security.admin-user", () -> "admin");
        registry.add("app.security.admin-password", () -> "admin123");
        registry.add("app.security.admin-role", () -> "ADMIN");
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void shouldHaveEmpleadosTableCreatedByFlyway() {
        Integer tableCount = jdbcTemplate.queryForObject(
                "select count(*) from information_schema.tables where table_name = 'empleados'",
                Integer.class
        );

        assertThat(tableCount).isEqualTo(1);
    }

    @Test
    void shouldGenerateConsecutiveValueFromSequence() {
        Long nextVal = jdbcTemplate.queryForObject("select nextval('empleados_seq')", Long.class);
        assertThat(nextVal).isNotNull();
        assertThat(nextVal).isGreaterThan(0L);
    }
}
