package com.medicore.hms.clinical;

import com.medicore.hms.common.ResourceNotFoundException;
import com.medicore.hms.doctor.Doctor;
import com.medicore.hms.doctor.DoctorRepository;
import com.medicore.hms.patient.Patient;
import com.medicore.hms.patient.PatientRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClinicalService {

    private final EncounterRepository encounterRepository;
    private final VitalSignRepository vitalSignRepository;
    private final ClinicalNoteRepository clinicalNoteRepository;
    private final DiagnosisRepository diagnosisRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClinicalSummaryDto {
        private Long patientId;
        private List<VitalSign> vitals;
        private List<ClinicalNote> notes;
        private List<Diagnosis> diagnoses;
        private List<Prescription> prescriptions;
        private List<Encounter> encounters;
    }

    @Transactional(readOnly = true)
    public List<Encounter> getPatientEncounters(Long patientId) {
        return encounterRepository.findByPatientIdOrderByStartTimeDesc(patientId);
    }

    @Transactional(readOnly = true)
    public Encounter getEncounterById(Long id) {
        return encounterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Encounter", "id", id));
    }

    @Transactional
    public Encounter startEncounter(Long patientId, Long doctorId, String chiefComplaint) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        Doctor doctor = doctorId != null ? doctorRepository.findById(doctorId).orElse(null) : null;

        String encNumber = "ENC-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

        Encounter encounter = Encounter.builder()
                .encounterNumber(encNumber)
                .patient(patient)
                .doctor(doctor)
                .encounterType("OPD")
                .status("IN_PROGRESS")
                .chiefComplaint(chiefComplaint)
                .startTime(Instant.now())
                .build();

        return encounterRepository.save(encounter);
    }

    @Transactional
    public VitalSign recordVitals(Long patientId, Long encounterId, VitalSign vitals) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        vitals.setPatient(patient);
        vitals.setEncounterId(encounterId);
        vitals.setRecordedAt(Instant.now());
        return vitalSignRepository.save(vitals);
    }

    @Transactional(readOnly = true)
    public List<VitalSign> getPatientVitals(Long patientId) {
        return vitalSignRepository.findByPatientIdOrderByRecordedAtDesc(patientId);
    }

    @Transactional
    public ClinicalNote addClinicalNote(Long patientId, Long doctorId, Long encounterId, ClinicalNote note) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        Doctor doctor = doctorId != null ? doctorRepository.findById(doctorId).orElse(null) : null;

        note.setPatient(patient);
        note.setDoctor(doctor);
        note.setEncounterId(encounterId);
        note.setCreatedAt(Instant.now());
        return clinicalNoteRepository.save(note);
    }

    @Transactional(readOnly = true)
    public List<ClinicalNote> getPatientNotes(Long patientId) {
        return clinicalNoteRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    @Transactional
    public Diagnosis addDiagnosis(Long patientId, Long encounterId, Diagnosis diagnosis) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        diagnosis.setPatient(patient);
        diagnosis.setEncounterId(encounterId);
        return diagnosisRepository.save(diagnosis);
    }

    @Transactional(readOnly = true)
    public List<Diagnosis> getPatientDiagnoses(Long patientId) {
        return diagnosisRepository.findByPatientIdOrderByDiagnosedDateDesc(patientId);
    }

    @Transactional
    public Prescription createPrescription(Long patientId, Long doctorId, Long encounterId, Prescription prescription) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        Doctor doctor = doctorId != null ? doctorRepository.findById(doctorId).orElse(null) : null;

        String rxNumber = "RX-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        prescription.setPrescriptionNumber(rxNumber);
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setEncounterId(encounterId);
        prescription.setPrescribedAt(Instant.now());

        if (prescription.getItems() != null) {
            for (PrescriptionItem item : prescription.getItems()) {
                item.setPrescription(prescription);
            }
        }

        return prescriptionRepository.save(prescription);
    }

    @Transactional(readOnly = true)
    public List<Prescription> getPatientPrescriptions(Long patientId) {
        return prescriptionRepository.findByPatientIdOrderByPrescribedAtDesc(patientId);
    }

    @Transactional(readOnly = true)
    public ClinicalSummaryDto getClinicalSummary(Long patientId) {
        return ClinicalSummaryDto.builder()
                .patientId(patientId)
                .vitals(vitalSignRepository.findByPatientIdOrderByRecordedAtDesc(patientId))
                .notes(clinicalNoteRepository.findByPatientIdOrderByCreatedAtDesc(patientId))
                .diagnoses(diagnosisRepository.findByPatientIdOrderByDiagnosedDateDesc(patientId))
                .prescriptions(prescriptionRepository.findByPatientIdOrderByPrescribedAtDesc(patientId))
                .encounters(encounterRepository.findByPatientIdOrderByStartTimeDesc(patientId))
                .build();
    }
}
