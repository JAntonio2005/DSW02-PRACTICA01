package com.dsw02.practica01.departamentos.web;

import com.dsw02.practica01.departamentos.dto.DepartamentoRequest;
import com.dsw02.practica01.departamentos.dto.DepartamentoResponse;
import com.dsw02.practica01.departamentos.service.DepartamentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/departamentos")
@Tag(name = "Departamentos", description = "Operaciones CRUD de departamentos")
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    public DepartamentoController(DepartamentoService departamentoService) {
        this.departamentoService = departamentoService;
    }

    @PostMapping
    @Operation(summary = "Crear departamento")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Departamento creado"),
            @ApiResponse(responseCode = "400", description = "Error de validación"),
            @ApiResponse(responseCode = "409", description = "Nombre de departamento duplicado")
    })
    public ResponseEntity<DepartamentoResponse> create(@Valid @RequestBody DepartamentoRequest request) {
        DepartamentoResponse response = departamentoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Listar departamentos con paginación")
    public ResponseEntity<Page<DepartamentoResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(departamentoService.findAll(page, size));
    }

    @GetMapping("/{clave}")
    @Operation(summary = "Obtener departamento por clave")
    public ResponseEntity<DepartamentoResponse> getByClave(@PathVariable String clave) {
        return ResponseEntity.ok(departamentoService.findByClave(clave));
    }

    @PutMapping("/{clave}")
    @Operation(summary = "Actualizar departamento por clave")
    public ResponseEntity<DepartamentoResponse> update(
            @PathVariable String clave,
            @Valid @RequestBody DepartamentoRequest request
    ) {
        return ResponseEntity.ok(departamentoService.update(clave, request));
    }

    @DeleteMapping("/{clave}")
    @Operation(summary = "Eliminar departamento por clave")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Departamento eliminado"),
            @ApiResponse(responseCode = "409", description = "Departamento con empleados asociados")
    })
    public ResponseEntity<Void> delete(@PathVariable String clave) {
        departamentoService.delete(clave);
        return ResponseEntity.noContent().build();
    }
}
