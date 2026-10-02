package com.medicore.hms.admission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NursingNoteRepository extends JpaRepository<NursingNote, Long> {
    List<NursingNote> findByAdmissionIdOrderByRecordedAtDesc(Long admissionId);
    List<NursingNote> findByPatientIdOrderByRecordedAtDesc(Long patientId);
}
