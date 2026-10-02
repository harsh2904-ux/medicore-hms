package com.medicore.hms.admission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, Long> {
    Optional<Admission> findByAdmissionNumber(String admissionNumber);
    List<Admission> findByPatientIdOrderByAdmissionDateDesc(Long patientId);
    List<Admission> findByStatus(String status);
    long countByStatus(String status);
}
