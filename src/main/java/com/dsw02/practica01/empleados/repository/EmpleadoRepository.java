package com.dsw02.practica01.empleados.repository;

import com.dsw02.practica01.empleados.domain.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpleadoRepository extends JpaRepository<Empleado, String> {
}
