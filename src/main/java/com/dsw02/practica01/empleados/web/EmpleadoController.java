package com.dsw02.practica01.empleados.web;

import com.dsw02.practica01.empleados.dto.EmpleadoRequest;
import com.dsw02.practica01.empleados.dto.EmpleadoResponse;
import com.dsw02.practica01.empleados.service.EmpleadoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/empleados")
@Tag(name = "Empleados", description = "Operaciones CRUD de empleados")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    public EmpleadoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @GetMapping
    @Operation(summary = "Listar empleados")
    public ResponseEntity<List<EmpleadoResponse>> list() {
        return ResponseEntity.ok(empleadoService.findAll());
    }

    @PostMapping
    @Operation(summary = "Crear empleado")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Empleado creado",
                    content = @Content(schema = @Schema(implementation = EmpleadoResponse.class))),
            @ApiResponse(responseCode = "400", description = "Error de validación")
    })
    public ResponseEntity<EmpleadoResponse> create(@Valid @RequestBody EmpleadoRequest request) {
        EmpleadoResponse response = empleadoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{clave}")
    @Operation(summary = "Obtener empleado por clave")
    public ResponseEntity<EmpleadoResponse> getByClave(
            @Parameter(description = "Clave con formato EMP-<numero>") @PathVariable String clave
    ) {
        return ResponseEntity.ok(empleadoService.findByClave(clave));
    }

    @PutMapping("/{clave}")
    @Operation(summary = "Actualizar empleado por clave")
    public ResponseEntity<EmpleadoResponse> update(
            @PathVariable String clave,
            @Valid @RequestBody EmpleadoRequest request
    ) {
        return ResponseEntity.ok(empleadoService.update(clave, request));
    }

    @DeleteMapping("/{clave}")
    @Operation(summary = "Eliminar empleado por clave")
    @ApiResponse(responseCode = "204", description = "Empleado eliminado")
    public ResponseEntity<Void> delete(@PathVariable String clave) {
        empleadoService.delete(clave);
        return ResponseEntity.noContent().build();
    }
}
