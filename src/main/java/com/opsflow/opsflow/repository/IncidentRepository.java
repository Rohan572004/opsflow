package com.opsflow.opsflow.repository;

import com.opsflow.opsflow.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
}