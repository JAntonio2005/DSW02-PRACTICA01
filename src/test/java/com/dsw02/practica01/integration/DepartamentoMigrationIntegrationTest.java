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
@Testcontainers(disabledWithoutDocker = true)
class DepartamentoMigrationIntegrationTest {

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
        registry.add("app.jwt.secret", () -> "0123456789ABCDEF0123456789ABCDEF");
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void shouldBackfillExistingEmpleadosWithValidDepartamento() {
        Integer nullCount = jdbcTemplate.queryForObject(
                "select count(*) from empleados where departamento_clave is null",
                Integer.class
        );
        Integer invalidFkCount = jdbcTemplate.queryForObject(
                "select count(*) from empleados e left join departamentos d on d.clave = e.departamento_clave where d.clave is null",
                Integer.class
        );

        assertThat(nullCount).isZero();
        assertThat(invalidFkCount).isZero();
    }

    @Test
    void shouldHaveNotNullAndForeignKeyConstraintsActive() {
        Integer notNullConstraint = jdbcTemplate.queryForObject(
                """
                        select count(*)
                        from information_schema.columns
                        where table_name = 'empleados'
                          and column_name = 'departamento_clave'
                          and is_nullable = 'NO'
                        """,
                Integer.class
        );

        Integer fkConstraint = jdbcTemplate.queryForObject(
                """
                        select count(*)
                        from information_schema.table_constraints
                        where table_name = 'empleados'
                          and constraint_type = 'FOREIGN KEY'
                          and constraint_name = 'fk_empleados_departamento'
                        """,
                Integer.class
        );

        assertThat(notNullConstraint).isEqualTo(1);
        assertThat(fkConstraint).isEqualTo(1);
    }
}
