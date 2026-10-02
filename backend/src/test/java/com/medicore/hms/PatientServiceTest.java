package com.medicore.hms;

import com.medicore.hms.patient.CreatePatientRequest;
import com.medicore.hms.patient.Patient;
import com.medicore.hms.patient.PatientDto;
import com.medicore.hms.patient.PatientRepository;
import com.medicore.hms.patient.PatientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private PatientService patientService;

    private Patient samplePatient;

    @BeforeEach
    void setUp() {
        samplePatient = Patient.builder()
                .id(1L)
                .mrn("MC-2026-001")
                .firstName("John")
                .lastName("Doe")
                .gender("MALE")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .phone("+1 555-0199")
                .status("ACTIVE")
                .build();
    }

    @Test
    void testGetPatientById_Success() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(samplePatient));

        PatientDto result = patientService.getPatientById(1L);

        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals("MC-2026-001", result.getMrn());
        verify(patientRepository, times(1)).findById(1L);
    }

    @Test
    void testCreatePatient_GeneratesMrn() {
        when(patientRepository.save(any(Patient.class))).thenAnswer(invocation -> {
            Patient p = invocation.getArgument(0);
            p.setId(2L);
            return p;
        });

        CreatePatientRequest req = CreatePatientRequest.builder()
                .firstName("Jane")
                .lastName("Smith")
                .gender("FEMALE")
                .dateOfBirth(LocalDate.of(1995, 5, 15))
                .phone("+1 555-0200")
                .allergies(List.of("Penicillin"))
                .build();

        PatientDto result = patientService.createPatient(req);

        assertNotNull(result);
        assertNotNull(result.getMrn());
        assertTrue(result.getMrn().startsWith("MC-"));
        assertEquals("Jane Smith", result.getName());
        verify(patientRepository, times(1)).save(any(Patient.class));
    }
}
