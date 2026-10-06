package com.opsflow.opsflow.dto;

import com.opsflow.opsflow.entity.IncidentPriority;
import com.opsflow.opsflow.entity.IncidentStatus;

import java.time.LocalDateTime;

public class IncidentResponse {

    private Long id;
    private String title;
    private String description;
    private IncidentPriority priority;
    private IncidentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public IncidentResponse() {
    }

    public IncidentResponse(
            Long id,
            String title,
            String description,
            IncidentPriority priority,
            IncidentStatus status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public IncidentPriority getPriority() {
        return priority;
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}