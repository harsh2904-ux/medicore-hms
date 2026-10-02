package com.medicore.hms.laboratory;

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

@Tag(name = "Laboratory", description = "Endpoints for clinical diagnostic test orders, specimen catalog, and lab results")
@RestController
@RequestMapping("/api/v1/laboratory")
@RequiredArgsConstructor
public class LabController {

    private final LabService labService;

    @Operation(summary = "List all available diagnostic lab tests")
    @GetMapping("/tests")
    public ResponseEntity<ApiResponse<List<LabTest>>> getAllTests() {
        return ResponseEntity.ok(ApiResponse.ok(labService.getAllTests()));
    }

    @Operation(summary = "List lab orders")
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<LabOrder>>> getOrders(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(labService.getOrders(patientId, status)));
    }

    @Operation(summary = "Get lab order by ID")
    @GetMapping("/orders/{id}")
    public ResponseEntity<ApiResponse<LabOrder>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(labService.getOrderById(id)));
    }

    @Operation(summary = "Create diagnostic lab order")
    @PostMapping("/orders")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<LabOrder>> createOrder(@RequestBody Map<String, Object> body) {
        Long patientId = Long.valueOf(body.get("patientId").toString());
        Long doctorId = body.containsKey("doctorId") && body.get("doctorId") != null ? Long.valueOf(body.get("doctorId").toString()) : null;
        Long testId = body.containsKey("testId") && body.get("testId") != null ? Long.valueOf(body.get("testId").toString()) : null;
        String priority = body.containsKey("priority") ? (String) body.get("priority") : "ROUTINE";
        String clinicalNotes = body.containsKey("clinicalNotes") ? (String) body.get("clinicalNotes") : null;

        LabOrder created = labService.createOrder(patientId, doctorId, testId, priority, clinicalNotes);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Lab order submitted", created));
    }

    @Operation(summary = "Record result for lab order")
    @PostMapping("/orders/{orderId}/results")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<LabResult>> recordResult(
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> body) {
        Long testId = Long.valueOf(body.get("testId").toString());
        String resultValue = (String) body.get("resultValue");
        String flag = body.containsKey("flag") ? (String) body.get("flag") : "NORMAL";
        String notes = body.containsKey("notes") ? (String) body.get("notes") : null;
        String verifiedBy = body.containsKey("verifiedBy") ? (String) body.get("verifiedBy") : "Technician";

        LabResult result = labService.recordResult(orderId, testId, resultValue, flag, notes, verifiedBy);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Lab result saved", result));
    }
}
