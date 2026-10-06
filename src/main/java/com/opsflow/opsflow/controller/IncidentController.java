package com.opsflow.opsflow.controller;

import com.opsflow.opsflow.dto.IncidentRequest;
import com.opsflow.opsflow.dto.IncidentResponse;
import com.opsflow.opsflow.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping
    public ResponseEntity<IncidentResponse> createIncident(
            @Valid @RequestBody IncidentRequest request) {

        IncidentResponse response = incidentService.createIncident(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<IncidentResponse>> getAllIncidents() {

        return ResponseEntity.ok(
                incidentService.getAllIncidents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getIncident(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                incidentService.getIncidentById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidentResponse> updateIncident(
            @PathVariable Long id,
            @Valid @RequestBody IncidentRequest request) {

        return ResponseEntity.ok(
                incidentService.updateIncident(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncident(
            @PathVariable Long id) {

        incidentService.deleteIncident(id);

        return ResponseEntity.noContent().build();
    }
}