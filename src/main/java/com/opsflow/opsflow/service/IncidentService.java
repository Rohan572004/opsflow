package com.opsflow.opsflow.service;

import com.opsflow.opsflow.dto.IncidentRequest;
import com.opsflow.opsflow.dto.IncidentResponse;
import com.opsflow.opsflow.entity.Incident;
import com.opsflow.opsflow.exception.IncidentNotFoundException;
import com.opsflow.opsflow.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public IncidentResponse createIncident(IncidentRequest request) {

        Incident incident = new Incident(
                request.getTitle(),
                request.getDescription(),
                request.getPriority(),
                request.getStatus());

        Incident savedIncident = incidentRepository.save(incident);

        return convertToResponse(savedIncident);
    }

    public List<IncidentResponse> getAllIncidents() {

        return incidentRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public IncidentResponse getIncidentById(Long id) {

        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new IncidentNotFoundException(id));

        return convertToResponse(incident);
    }

    public IncidentResponse updateIncident(
            Long id,
            IncidentRequest request) {

        Incident existingIncident = incidentRepository.findById(id)
                .orElseThrow(() -> new IncidentNotFoundException(id));

        existingIncident.setTitle(request.getTitle());
        existingIncident.setDescription(request.getDescription());
        existingIncident.setPriority(request.getPriority());
        existingIncident.setStatus(request.getStatus());

        Incident updatedIncident = incidentRepository.save(existingIncident);

        return convertToResponse(updatedIncident);
    }

    public void deleteIncident(Long id) {

        if (!incidentRepository.existsById(id)) {
            throw new IncidentNotFoundException(id);
        }

        incidentRepository.deleteById(id);
    }

    private IncidentResponse convertToResponse(Incident incident) {

        return new IncidentResponse(
                incident.getId(),
                incident.getTitle(),
                incident.getDescription(),
                incident.getPriority(),
                incident.getStatus(),
                incident.getCreatedAt(),
                incident.getUpdatedAt());
    }
}