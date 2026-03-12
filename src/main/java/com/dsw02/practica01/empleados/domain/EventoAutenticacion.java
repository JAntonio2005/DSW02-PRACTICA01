package com.dsw02.practica01.empleados.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "evento_autenticacion")
public class EventoAutenticacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "clave_empleado", length = 100)
    private String claveEmpleado;

    @Column(name = "correo", length = 255)
    private String correo;

    @Column(name = "exitoso", nullable = false)
    private boolean exitoso;

    @Column(name = "detalle", length = 255)
    private String detalle;

    @Column(name = "fecha_hora", nullable = false)
    private Instant fechaHora;

    public Long getId() {
        return id;
    }

    public String getClaveEmpleado() {
        return claveEmpleado;
    }

    public void setClaveEmpleado(String claveEmpleado) {
        this.claveEmpleado = claveEmpleado;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public boolean isExitoso() {
        return exitoso;
    }

    public void setExitoso(boolean exitoso) {
        this.exitoso = exitoso;
    }

    public String getDetalle() {
        return detalle;
    }

    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }

    public Instant getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(Instant fechaHora) {
        this.fechaHora = fechaHora;
    }
}
