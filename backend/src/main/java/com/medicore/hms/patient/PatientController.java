package com.medicore.hms.patient;

import com.medicore.hms.common.ApiResponse;
import com.medicore.hms.common.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Patients", description = "Endpoints for managing patient registrations, records, and search")
@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @Operation(summary = "Search and list patients with pagination")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PatientDto>>> getPatients(
            @RequestParam(required = false) String query,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<PatientDto> page = patientService.getPatients(query, pageable);
        return ResponseEntity.ok(ApiResponse.ok(page));
    }

    @Operation(summary = "Get patient by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientDto>> getPatientById(@PathVariable Long id) {
        PatientDto patient = patientService.getPatientById(id);
        return ResponseEntity.ok(ApiResponse.ok(patient));
    }

    @Operation(summary = "Get patient by Medical Record Number (MRN)")
    @GetMapping("/mrn/{mrn}")
    public ResponseEntity<ApiResponse<PatientDto>> getPatientByMrn(@PathVariable String mrn) {
        PatientDto patient = patientService.getPatientByMrn(mrn);
        return ResponseEntity.ok(ApiResponse.ok(patient));
    }

    @Operation(summary = "Register new patient")
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE')")
    public ResponseEntity<ApiResponse<PatientDto>> createPatient(@Valid @RequestBody CreatePatientRequest request) {
        PatientDto created = patientService.createPatient(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Patient registered successfully", created));
    }

    @Operation(summary = "Update patient record")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE')")
    public ResponseEntity<ApiResponse<PatientDto>> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody CreatePatientRequest request) {
        PatientDto updated = patientService.updatePatient(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Patient updated successfully", updated));
    }

    @Operation(summary = "Delete patient record")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok(ApiResponse.ok("Patient record deleted", null));
    }
}
