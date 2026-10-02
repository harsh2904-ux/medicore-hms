package com.medicore.hms.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, Long> {
    Optional<InsuranceClaim> findByClaimNumber(String claimNumber);
    List<InsuranceClaim> findByPatientId(Long patientId);
    List<InsuranceClaim> findByStatus(String status);
}
