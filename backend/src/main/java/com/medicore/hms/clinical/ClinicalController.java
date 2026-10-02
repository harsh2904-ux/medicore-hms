package com.medicore.hms.clinical;

import com.medicore.hms.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Clinical & EMR", description = "Endpoints for electronic medical records, clinical SOAP notes, vitals, and diagnoses")
@RestController
@RequestMapping("/api/v1/clinical")
@RequiredArgsConstructor
public class ClinicalController {

    private final ClinicalService clinicalService;

    @Operation(summary = "Get full clinical EMR summary for a patient")
    @GetMapping("/patients/{patientId}/summary")
    public ResponseEntity<ApiResponse<ClinicalService.ClinicalSummaryDto>> getClinicalSummary(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok(clinicalService.getClinicalSummary(patientId)));
    }

    @Operation(summary = "Get patient vital sign history")
    @GetMapping("/patients/{patientId}/vitals")
    public ResponseEntity<ApiResponse<List<VitalSign>>> getPatientVitals(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok(clinicalService.getPatientVitals(patientId)));
    }

    @Operation(summary = "Record patient vital signs")
    @PostMapping("/patients/{patientId}/vitals")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<ApiResponse<VitalSign>> recordVitals(
            @PathVariable Long patientId,
            @RequestParam(required = false) Long encounterId,
            @RequestBody VitalSign vitals) {
        VitalSign recorded = clinicalService.recordVitals(patientId, encounterId, vitals);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Vitals recorded successfully", recorded));
    }

    @Operation(summary = "Get patient clinical notes")
    @GetMapping("/patients/{patientId}/notes")
    public ResponseEntity<ApiResponse<List<ClinicalNote>>> getPatientNotes(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok(clinicalService.getPatientNotes(patientId)));
    }

    @Operation(summary = "Add clinical SOAP note")
    @PostMapping("/patients/{patientId}/notes")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<ClinicalNote>> addClinicalNote(
            @PathVariable Long patientId,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long encounterId,
            @RequestBody ClinicalNote note) {
        ClinicalNote added = clinicalService.addClinicalNote(patientId, doctorId, encounterId, note);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Clinical note saved", added));
    }

    @Operation(summary = "Get patient diagnoses")
    @GetMapping("/patients/{patientId}/diagnoses")
    public ResponseEntity<ApiResponse<List<Diagnosis>>> getPatientDiagnoses(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok(clinicalService.getPatientDiagnoses(patientId)));
    }

    @Operation(summary = "Add diagnosis to patient")
    @PostMapping("/patients/{patientId}/diagnoses")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<Diagnosis>> addDiagnosis(
            @PathVariable Long patientId,
            @RequestParam(required = false) Long encounterId,
            @RequestBody Diagnosis diagnosis) {
        Diagnosis added = clinicalService.addDiagnosis(patientId, encounterId, diagnosis);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Diagnosis recorded", added));
    }

    @Operation(summary = "Start clinical encounter")
    @PostMapping("/encounters/start")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<Encounter>> startEncounter(@RequestBody Map<String, Object> body) {
        Long patientId = Long.valueOf(body.get("patientId").toString());
        Long doctorId = body.containsKey("doctorId") && body.get("doctorId") != null ? Long.valueOf(body.get("doctorId").toString()) : null;
        String complaint = body.containsKey("chiefComplaint") ? (String) body.get("chiefComplaint") : "Consultation";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Encounter started", clinicalService.startEncounter(patientId, doctorId, complaint)));
    }

    @Operation(summary = "Get patient prescriptions")
    @GetMapping("/patients/{patientId}/prescriptions")
    public ResponseEntity<ApiResponse<List<Prescription>>> getPatientPrescriptions(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok(clinicalService.getPatientPrescriptions(patientId)));
    }

    @Operation(summary = "Issue electronic prescription")
    @PostMapping("/patients/{patientId}/prescriptions")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<Prescription>> createPrescription(
            @PathVariable Long patientId,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long encounterId,
            @RequestBody Prescription prescription) {
        Prescription created = clinicalService.createPrescription(patientId, doctorId, encounterId, prescription);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Prescription issued", created));
    }
}
