package com.dsw02.practica01.departamentos.repository;

import com.dsw02.practica01.departamentos.domain.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartamentoRepository extends JpaRepository<Departamento, String> {

    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndClaveNot(String nombre, String clave);
}
