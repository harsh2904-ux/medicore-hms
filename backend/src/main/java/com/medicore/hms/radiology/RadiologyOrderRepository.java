package com.medicore.hms.radiology;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RadiologyOrderRepository extends JpaRepository<RadiologyOrder, Long> {
    Optional<RadiologyOrder> findByOrderNumber(String orderNumber);
    List<RadiologyOrder> findByPatientIdOrderByOrderedAtDesc(Long patientId);
    List<RadiologyOrder> findByStatus(String status);
}
