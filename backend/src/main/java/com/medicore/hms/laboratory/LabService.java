package com.medicore.hms.laboratory;

import com.medicore.hms.common.ResourceNotFoundException;
import com.medicore.hms.patient.Patient;
import com.medicore.hms.patient.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LabService {

    private final LabTestRepository labTestRepository;
    private final LabOrderRepository labOrderRepository;
    private final LabResultRepository labResultRepository;
    private final PatientRepository patientRepository;

    @Transactional(readOnly = true)
    public List<LabTest> getAllTests() {
        return labTestRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<LabOrder> getOrders(Long patientId, String status) {
        if (patientId != null) {
            return labOrderRepository.findByPatientIdOrderByOrderedAtDesc(patientId);
        }
        if (status != null) {
            return labOrderRepository.findByStatus(status);
        }
        return labOrderRepository.findAll();
    }

    @Transactional(readOnly = true)
    public LabOrder getOrderById(Long id) {
        return labOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LabOrder", "id", id));
    }

    @Transactional
    public LabOrder createOrder(Long patientId, Long doctorId, Long testId, String priority, String clinicalNotes) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        String orderNo = "LBO-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

        LabOrder order = LabOrder.builder()
                .orderNumber(orderNo)
                .patient(patient)
                .priority(priority != null ? priority.toUpperCase() : "ROUTINE")
                .status("ORDERED")
                .clinicalNotes(clinicalNotes)
                .orderedAt(Instant.now())
                .build();

        LabOrder saved = labOrderRepository.save(order);

        if (testId != null) {
            LabTest test = labTestRepository.findById(testId)
                    .orElseThrow(() -> new ResourceNotFoundException("LabTest", "id", testId));

            LabResult result = LabResult.builder()
                    .order(saved)
                    .test(test)
                    .referenceRange(test.getNormalRange())
                    .unit(test.getUnit())
                    .flag("PENDING")
                    .resultDate(Instant.now())
                    .build();

            labResultRepository.save(result);
        }

        return saved;
    }

    @Transactional
    public LabResult recordResult(Long orderId, Long testId, String resultValue, String flag, String notes, String verifiedBy) {
        LabOrder order = labOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("LabOrder", "id", orderId));

        LabTest test = labTestRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("LabTest", "id", testId));

        LabResult result = LabResult.builder()
                .order(order)
                .test(test)
                .resultValue(resultValue)
                .unit(test.getUnit())
                .referenceRange(test.getNormalRange())
                .flag(flag != null ? flag.toUpperCase() : "NORMAL")
                .technicianNotes(notes)
                .verifiedBy(verifiedBy)
                .resultDate(Instant.now())
                .build();

        LabResult saved = labResultRepository.save(result);
        order.setStatus("COMPLETED");
        labOrderRepository.save(order);

        return saved;
    }
}
