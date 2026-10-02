package com.medicore.hms.admission;

import com.medicore.hms.common.ApiResponse;
import com.medicore.hms.common.ResourceNotFoundException;
import com.medicore.hms.patient.Patient;
import com.medicore.hms.patient.PatientRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Tag(name = "Emergency & Trauma", description = "Endpoints for Level-1 trauma admissions, triage scoring, and acute patient queue")
@RestController
@RequestMapping("/api/v1/emergency")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyTriageRepository triageRepository;
    private final PatientRepository patientRepository;

    @Operation(summary = "List all active emergency triage cases")
    @GetMapping("/triages")
    public ResponseEntity<ApiResponse<List<EmergencyTriage>>> getTriages(
            @RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(ApiResponse.ok(triageRepository.findByStatusOrderByArrivedAtDesc(status)));
        }
        return ResponseEntity.ok(ApiResponse.ok(triageRepository.findAllByOrderByArrivedAtDesc()));
    }

    @Operation(summary = "Admit and triage emergency case")
    @PostMapping("/triages")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<ApiResponse<EmergencyTriage>> createTriage(@RequestBody Map<String, Object> body) {
        Long patientId = Long.valueOf(body.get("patientId").toString());
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        String triageLevel = (String) body.getOrDefault("triageLevel", "LEVEL_2_EMERGENT");
        String complaint = (String) body.get("chiefComplaint");
        String vitalsSummary = (String) body.getOrDefault("vitalsSummary", null);

        String triageNo = "TRG-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

        EmergencyTriage triage = EmergencyTriage.builder()
                .triageNumber(triageNo)
                .patient(patient)
                .triageLevel(triageLevel)
                .chiefComplaint(complaint)
                .vitalsSummary(vitalsSummary)
                .status("TRIAGED")
                .arrivedAt(Instant.now())
                .build();

        EmergencyTriage saved = triageRepository.save(triage);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Emergency triage registered", saved));
    }
}
