package com.medicore.hms.laboratory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabOrderRepository extends JpaRepository<LabOrder, Long> {
    Optional<LabOrder> findByOrderNumber(String orderNumber);
    List<LabOrder> findByPatientIdOrderByOrderedAtDesc(Long patientId);
    List<LabOrder> findByStatus(String status);
}
