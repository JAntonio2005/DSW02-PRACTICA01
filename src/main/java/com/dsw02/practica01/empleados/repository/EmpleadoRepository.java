package com.dsw02.practica01.empleados.repository;

import com.dsw02.practica01.empleados.domain.Empleado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface EmpleadoRepository extends JpaRepository<Empleado, String> {

	@Query(
			value = "SELECT * FROM empleados ORDER BY CAST(split_part(clave, '-', 2) AS BIGINT) ASC",
			countQuery = "SELECT COUNT(*) FROM empleados",
			nativeQuery = true
	)
	Page<Empleado> findAllOrderByClaveNumeric(Pageable pageable);

		Optional<Empleado> findByCorreoIgnoreCase(String correo);

		boolean existsByCorreoIgnoreCase(String correo);

		boolean existsByCorreoIgnoreCaseAndClaveNot(String correo, String clave);
}
