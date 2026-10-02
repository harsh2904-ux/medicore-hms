package com.medicore.hms.admission;

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

@Tag(name = "Inpatient Department (IPD)", description = "Endpoints for inpatient admissions, discharges, bed tracking, and nursing records")
@RestController
@RequestMapping("/api/v1/ipd")
@RequiredArgsConstructor
public class IpdController {

    private final IpdService ipdService;

    @Operation(summary = "Get inpatient bed allocation statistics")
    @GetMapping("/beds/stats")
    public ResponseEntity<ApiResponse<IpdService.BedStatsDto>> getBedStats() {
        return ResponseEntity.ok(ApiResponse.ok(ipdService.getBedStats()));
    }

    @Operation(summary = "List all hospital wards")
    @GetMapping("/wards")
    public ResponseEntity<ApiResponse<List<Ward>>> getWards() {
        return ResponseEntity.ok(ApiResponse.ok(ipdService.getAllWards()));
    }

    @Operation(summary = "List beds by ward or status")
    @GetMapping("/beds")
    public ResponseEntity<ApiResponse<List<Bed>>> getBeds(
            @RequestParam(required = false) Long wardId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(ipdService.getBeds(wardId, status)));
    }

    @Operation(summary = "List inpatient admissions")
    @GetMapping("/admissions")
    public ResponseEntity<ApiResponse<List<Admission>>> getAdmissions(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(ipdService.getAdmissions(status)));
    }

    @Operation(summary = "Admit patient into IPD ward")
    @PostMapping("/admissions")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<ApiResponse<Admission>> admitPatient(@RequestBody Map<String, Object> body) {
        Long patientId = Long.valueOf(body.get("patientId").toString());
        Long doctorId = body.containsKey("doctorId") && body.get("doctorId") != null ? Long.valueOf(body.get("doctorId").toString()) : null;
        Long bedId = body.containsKey("bedId") && body.get("bedId") != null ? Long.valueOf(body.get("bedId").toString()) : null;
        String type = body.containsKey("admissionType") ? (String) body.get("admissionType") : "ELECTIVE";
        String reason = body.containsKey("reason") ? (String) body.get("reason") : null;

        Admission admission = ipdService.admitPatient(patientId, doctorId, bedId, type, reason);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Patient admitted to IPD", admission));
    }

    @Operation(summary = "Discharge patient from IPD ward")
    @PostMapping("/admissions/{id}/discharge")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<Admission>> dischargePatient(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String summary = body.getOrDefault("dischargeSummary", "Discharged in stable condition");
        Admission admission = ipdService.dischargePatient(id, summary);
        return ResponseEntity.ok(ApiResponse.ok("Patient discharged successfully", admission));
    }

    @Operation(summary = "Add nursing note to inpatient admission")
    @PostMapping("/admissions/{id}/nursing-notes")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    public ResponseEntity<ApiResponse<NursingNote>> addNursingNote(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Long patientId = Long.valueOf(body.get("patientId").toString());
        String nurseName = (String) body.getOrDefault("nurseName", "Registered Nurse");
        String shift = (String) body.getOrDefault("shift", "DAY");
        String note = (String) body.get("note");

        NursingNote nursingNote = ipdService.addNursingNote(id, patientId, nurseName, shift, note);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Nursing note recorded", nursingNote));
    }
}
