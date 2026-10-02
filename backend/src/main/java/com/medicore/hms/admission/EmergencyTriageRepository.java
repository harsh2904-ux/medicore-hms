package com.medicore.hms.admission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyTriageRepository extends JpaRepository<EmergencyTriage, Long> {
    List<EmergencyTriage> findByStatusOrderByArrivedAtDesc(String status);
    List<EmergencyTriage> findAllByOrderByArrivedAtDesc();
}
