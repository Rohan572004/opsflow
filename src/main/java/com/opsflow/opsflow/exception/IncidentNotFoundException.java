package com.opsflow.opsflow.exception;

public class IncidentNotFoundException extends RuntimeException {

    public IncidentNotFoundException(Long id) {
        super("Incident with ID " + id + " not found");
    }
}