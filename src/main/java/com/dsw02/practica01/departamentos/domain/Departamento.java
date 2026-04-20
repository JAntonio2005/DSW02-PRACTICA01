package com.dsw02.practica01.departamentos.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "departamentos")
public class Departamento {

    @Id
    @Column(name = "clave", nullable = false, unique = true, length = 100)
    private String clave;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
