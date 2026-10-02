package com.medicore.hms.clinical;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EncounterRepository extends JpaRepository<Encounter, Long> {
    Optional<Encounter> findByEncounterNumber(String encounterNumber);
    List<Encounter> findByPatientIdOrderByStartTimeDesc(Long patientId);
    List<Encounter> findByDoctorId(Long doctorId);
}
