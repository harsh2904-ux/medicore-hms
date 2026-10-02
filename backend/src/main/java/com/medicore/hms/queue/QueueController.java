package com.medicore.hms.queue;

import com.medicore.hms.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Queue Management", description = "Endpoints for managing real-time OPD patient queue and token triage")
@RestController
@RequestMapping("/api/v1/queue")
@RequiredArgsConstructor
public class QueueController {

    private final QueueService queueService;

    @Operation(summary = "Get today's patient queue")
    @GetMapping
    public ResponseEntity<ApiResponse<List<QueueService.QueueDto>>> getTodayQueue(
            @RequestParam(required = false) Long doctorId) {
        return ResponseEntity.ok(ApiResponse.ok(queueService.getTodayQueue(doctorId)));
    }

    @Operation(summary = "Check in appointment to queue")
    @PostMapping("/check-in")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'NURSE')")
    public ResponseEntity<ApiResponse<QueueService.QueueDto>> checkIn(
            @RequestBody Map<String, Object> body) {
        Long appointmentId = Long.valueOf(body.get("appointmentId").toString());
        String priority = body.containsKey("priority") ? body.get("priority").toString() : "NORMAL";
        return ResponseEntity.ok(ApiResponse.ok("Patient checked in", queueService.checkIn(appointmentId, priority)));
    }

    @Operation(summary = "Update queue token status (CALL / COMPLETE / CANCEL)")
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE')")
    public ResponseEntity<ApiResponse<QueueService.QueueDto>> updateQueueStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(ApiResponse.ok("Queue updated", queueService.updateStatus(id, status)));
    }
}
