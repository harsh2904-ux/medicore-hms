package com.medicore.hms.clinical;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnosisRepository extends JpaRepository<Diagnosis, Long> {
    List<Diagnosis> findByPatientIdOrderByDiagnosedDateDesc(Long patientId);
    List<Diagnosis> findByEncounterId(Long encounterId);
}
