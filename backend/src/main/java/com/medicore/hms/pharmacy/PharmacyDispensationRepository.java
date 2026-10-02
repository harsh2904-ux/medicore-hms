package com.medicore.hms.pharmacy;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PharmacyDispensationRepository extends JpaRepository<PharmacyDispensation, Long> {
    List<PharmacyDispensation> findByPatientIdOrderByDispensedAtDesc(Long patientId);
}
