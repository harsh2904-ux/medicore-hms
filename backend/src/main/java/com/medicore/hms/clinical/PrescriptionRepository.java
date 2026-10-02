package com.medicore.hms.clinical;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    Optional<Prescription> findByPrescriptionNumber(String prescriptionNumber);
    List<Prescription> findByPatientIdOrderByPrescribedAtDesc(Long patientId);
    List<Prescription> findByEncounterId(Long encounterId);
}
