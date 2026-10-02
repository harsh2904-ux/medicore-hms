package com.medicore.hms.clinical;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VitalSignRepository extends JpaRepository<VitalSign, Long> {
    List<VitalSign> findByPatientIdOrderByRecordedAtDesc(Long patientId);
    List<VitalSign> findByEncounterId(Long encounterId);
}
