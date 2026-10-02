package com.medicore.hms.clinical;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicalNoteRepository extends JpaRepository<ClinicalNote, Long> {
    List<ClinicalNote> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<ClinicalNote> findByEncounterId(Long encounterId);
}
