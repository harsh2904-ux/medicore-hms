package com.medicore.hms.admission;

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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IpdService {

    private final WardRepository wardRepository;
    private final BedRepository bedRepository;
    private final AdmissionRepository admissionRepository;
    private final NursingNoteRepository nursingNoteRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BedStatsDto {
        private long totalBeds;
        private long occupiedBeds;
        private long availableBeds;
        private double occupancyRate;
    }

    @Transactional(readOnly = true)
    public List<Ward> getAllWards() {
        return wardRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Bed> getBeds(Long wardId, String status) {
        if (wardId != null) {
            return bedRepository.findByWardId(wardId);
        }
        if (status != null) {
            return bedRepository.findByStatus(status.toUpperCase());
        }
        return bedRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Admission> getAdmissions(String status) {
        if (status != null) {
            return admissionRepository.findByStatus(status.toUpperCase());
        }
        return admissionRepository.findAll();
    }

    @Transactional
    public Admission admitPatient(Long patientId, Long doctorId, Long bedId, String admissionType, String reason) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        Doctor doctor = doctorId != null ? doctorRepository.findById(doctorId).orElse(null) : null;

        Bed bed = null;
        if (bedId != null) {
            bed = bedRepository.findById(bedId)
                    .orElseThrow(() -> new ResourceNotFoundException("Bed", "id", bedId));
            bed.setStatus("OCCUPIED");
            bedRepository.save(bed);
        }

        patient.setStatus("ADMITTED");
        patientRepository.save(patient);

        String admNumber = "ADM-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

        Admission admission = Admission.builder()
                .admissionNumber(admNumber)
                .patient(patient)
                .attendingDoctor(doctor)
                .bed(bed)
                .admissionDate(Instant.now())
                .admissionType(admissionType != null ? admissionType.toUpperCase() : "ELECTIVE")
                .status("ADMITTED")
                .reason(reason)
                .build();

        return admissionRepository.save(admission);
    }

    @Transactional
    public Admission dischargePatient(Long admissionId, String dischargeSummary) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Admission", "id", admissionId));

        admission.setStatus("DISCHARGED");
        admission.setDischargeDate(Instant.now());
        admission.setDischargeSummary(dischargeSummary);

        if (admission.getBed() != null) {
            Bed bed = admission.getBed();
            bed.setStatus("AVAILABLE");
            bedRepository.save(bed);
        }

        Patient patient = admission.getPatient();
        if (patient != null) {
            patient.setStatus("ACTIVE");
            patientRepository.save(patient);
        }

        return admissionRepository.save(admission);
    }

    @Transactional
    public NursingNote addNursingNote(Long admissionId, Long patientId, String nurseName, String shift, String note) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        NursingNote nursingNote = NursingNote.builder()
                .admissionId(admissionId)
                .patient(patient)
                .nurseName(nurseName)
                .shift(shift != null ? shift.toUpperCase() : "DAY")
                .note(note)
                .recordedAt(Instant.now())
                .build();

        return nursingNoteRepository.save(nursingNote);
    }

    @Transactional(readOnly = true)
    public BedStatsDto getBedStats() {
        long total = bedRepository.count();
        long occupied = bedRepository.countByStatus("OCCUPIED");
        long available = bedRepository.countByStatus("AVAILABLE");
        double rate = total > 0 ? ((double) occupied / total) * 100.0 : 0.0;

        return BedStatsDto.builder()
                .totalBeds(total)
                .occupiedBeds(occupied)
                .availableBeds(available)
                .occupancyRate(Math.round(rate * 10.0) / 10.0)
                .build();
    }
}
