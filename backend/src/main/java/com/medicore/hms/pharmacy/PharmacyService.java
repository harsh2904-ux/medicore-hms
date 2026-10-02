package com.medicore.hms.pharmacy;

import com.medicore.hms.clinical.Prescription;
import com.medicore.hms.clinical.PrescriptionRepository;
import com.medicore.hms.common.ResourceNotFoundException;
import com.medicore.hms.patient.Patient;
import com.medicore.hms.patient.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PharmacyService {

    private final MedicineRepository medicineRepository;
    private final PharmacyDispensationRepository dispensationRepository;
    private final PatientRepository patientRepository;
    private final PrescriptionRepository prescriptionRepository;

    @Transactional(readOnly = true)
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine", "id", id));
    }

    @Transactional(readOnly = true)
    public List<PharmacyDispensation> getAllDispensations() {
        return dispensationRepository.findAll();
    }

    @Transactional
    public PharmacyDispensation dispense(Long prescriptionId, Long patientId, String dispensedBy, BigDecimal totalAmount) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        if (prescriptionId != null) {
            Prescription prescription = prescriptionRepository.findById(prescriptionId).orElse(null);
            if (prescription != null) {
                prescription.setStatus("DISPENSED");
                prescriptionRepository.save(prescription);
            }
        }

        String dispNumber = "DSP-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

        PharmacyDispensation disp = PharmacyDispensation.builder()
                .dispenseNumber(dispNumber)
                .prescriptionId(prescriptionId)
                .patient(patient)
                .dispensedBy(dispensedBy != null ? dispensedBy : "Pharmacist")
                .status("DISPENSED")
                .totalAmount(totalAmount != null ? totalAmount : BigDecimal.valueOf(25.00))
                .dispensedAt(Instant.now())
                .build();

        return dispensationRepository.save(disp);
    }
}
