package com.medicore.hms.appointment;

import com.medicore.hms.common.ApiResponse;
import com.medicore.hms.common.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@Tag(name = "Appointments", description = "Endpoints for scheduling, rescheduling, and status tracking of appointments")
@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Operation(summary = "Filter and list appointments")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AppointmentDto>>> getAppointments(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "appointmentDate", direction = Sort.Direction.ASC) Pageable pageable) {
        PageResponse<AppointmentDto> page = appointmentService.getAppointments(date, doctorId, status, pageable);
        return ResponseEntity.ok(ApiResponse.ok(page));
    }

    @Operation(summary = "Get appointment by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentDto>> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.getAppointmentById(id)));
    }

    @Operation(summary = "Book new appointment")
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE')")
    public ResponseEntity<ApiResponse<AppointmentDto>> createAppointment(@Valid @RequestBody CreateAppointmentRequest request) {
        AppointmentDto created = appointmentService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Appointment scheduled successfully", created));
    }

    @Operation(summary = "Update appointment status")
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE')")
    public ResponseEntity<ApiResponse<AppointmentDto>> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusBody) {
        String status = statusBody.get("status");
        AppointmentDto updated = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Appointment status updated", updated));
    }

    @Operation(summary = "Cancel / Delete appointment")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<ApiResponse<Void>> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok(ApiResponse.ok("Appointment cancelled", null));
    }
}
