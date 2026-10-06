package com.opsflow.opsflow.service;

import com.opsflow.opsflow.dto.IncidentRequest;
import com.opsflow.opsflow.dto.IncidentResponse;
import com.opsflow.opsflow.entity.Incident;
import com.opsflow.opsflow.entity.IncidentPriority;
import com.opsflow.opsflow.entity.IncidentStatus;
import com.opsflow.opsflow.exception.IncidentNotFoundException;
import com.opsflow.opsflow.repository.IncidentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentServiceTest {

    @Mock
    private IncidentRepository incidentRepository;

    @InjectMocks
    private IncidentService incidentService;

    private Incident incident;
    private IncidentRequest request;

    @BeforeEach
    void setUp() {

        request = new IncidentRequest();

        request.setTitle("Production API Down");
        request.setDescription("Payment API is unavailable");
        request.setPriority(IncidentPriority.CRITICAL);
        request.setStatus(IncidentStatus.OPEN);

        incident = new Incident(
                "Production API Down",
                "Payment API is unavailable",
                IncidentPriority.CRITICAL,
                IncidentStatus.OPEN);
    }

    @Test
    void shouldCreateIncident() {

        when(incidentRepository.save(any(Incident.class)))
                .thenReturn(incident);

        IncidentResponse response = incidentService.createIncident(request);

        assertNotNull(response);
        assertEquals(
                "Production API Down",
                response.getTitle());

        verify(incidentRepository, times(1))
                .save(any(Incident.class));
    }

    @Test
    void shouldGetAllIncidents() {

        when(incidentRepository.findAll())
                .thenReturn(List.of(incident));

        List<IncidentResponse> result = incidentService.getAllIncidents();

        assertEquals(1, result.size());

        assertEquals(
                "Production API Down",
                result.get(0).getTitle());

        verify(incidentRepository, times(1))
                .findAll();
    }

    @Test
    void shouldGetIncidentById() {

        when(incidentRepository.findById(1L))
                .thenReturn(Optional.of(incident));

        IncidentResponse response = incidentService.getIncidentById(1L);

        assertNotNull(response);

        assertEquals(
                "Production API Down",
                response.getTitle());

        verify(incidentRepository, times(1))
                .findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenIncidentDoesNotExist() {

        when(incidentRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                IncidentNotFoundException.class,
                () -> incidentService.getIncidentById(999L));

        verify(incidentRepository, times(1))
                .findById(999L);
    }

    @Test
    void shouldUpdateIncident() {

        when(incidentRepository.findById(1L))
                .thenReturn(Optional.of(incident));

        when(incidentRepository.save(any(Incident.class)))
                .thenReturn(incident);

        request.setTitle("Updated Production API");
        request.setStatus(IncidentStatus.IN_PROGRESS);

        IncidentResponse response = incidentService.updateIncident(1L, request);

        assertEquals(
                "Updated Production API",
                response.getTitle());

        assertEquals(
                IncidentStatus.IN_PROGRESS,
                response.getStatus());

        verify(incidentRepository)
                .save(any(Incident.class));
    }

    @Test
    void shouldDeleteIncident() {

        when(incidentRepository.existsById(1L))
                .thenReturn(true);

        incidentService.deleteIncident(1L);

        verify(incidentRepository, times(1))
                .deleteById(1L);
    }
}