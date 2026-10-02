package com.medicore.hms.patient;

import com.medicore.hms.common.PageResponse;
import com.medicore.hms.common.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    @Transactional(readOnly = true)
    public PageResponse<PatientDto> getPatients(String query, Pageable pageable) {
        Page<Patient> page = patientRepository.searchPatients(query, pageable);
        return PageResponse.from(page.map(PatientDto::fromEntity));
    }

    @Transactional(readOnly = true)
    public PatientDto getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        return PatientDto.fromEntity(patient);
    }

    @Transactional(readOnly = true)
    public PatientDto getPatientByMrn(String mrn) {
        Patient patient = patientRepository.findByMrn(mrn)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "mrn", mrn));
        return PatientDto.fromEntity(patient);
    }

    @Transactional
    public PatientDto createPatient(CreatePatientRequest request) {
        String mrn = "MC-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        String allergiesStr = request.getAllergies() != null ? String.join(", ", request.getAllergies()) : null;

        Patient patient = Patient.builder()
                .mrn(mrn)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .bloodGroup(request.getBloodGroup())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .city(request.getCity())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactPhone(request.getEmergencyContactPhone())
                .insuranceProvider(request.getInsuranceProvider())
                .insurancePolicyNumber(request.getInsurancePolicyNumber())
                .allergies(allergiesStr)
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();

        Patient saved = patientRepository.save(patient);
        log.info("Registered new patient with MRN: {}", saved.getMrn());
        return PatientDto.fromEntity(saved);
    }

    @Transactional
    public PatientDto updatePatient(Long id, CreatePatientRequest request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));

        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setGender(request.getGender());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setPhone(request.getPhone());
        patient.setEmail(request.getEmail());
        patient.setAddress(request.getAddress());
        patient.setCity(request.getCity());
        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactPhone(request.getEmergencyContactPhone());
        patient.setInsuranceProvider(request.getInsuranceProvider());
        patient.setInsurancePolicyNumber(request.getInsurancePolicyNumber());
        if (request.getAllergies() != null) {
            patient.setAllergies(String.join(", ", request.getAllergies()));
        }
        if (request.getStatus() != null) {
            patient.setStatus(request.getStatus());
        }

        Patient updated = patientRepository.save(patient);
        return PatientDto.fromEntity(updated);
    }

    @Transactional
    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        patientRepository.delete(patient);
    }
}
