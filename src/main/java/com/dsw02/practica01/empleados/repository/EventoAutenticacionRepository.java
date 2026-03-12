package com.dsw02.practica01.empleados.repository;

import com.dsw02.practica01.empleados.domain.EventoAutenticacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventoAutenticacionRepository extends JpaRepository<EventoAutenticacion, Long> {
}
