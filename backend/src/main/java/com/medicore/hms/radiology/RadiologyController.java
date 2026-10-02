package com.medicore.hms.radiology;

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

@Tag(name = "Radiology", description = "Endpoints for MRI, CT, X-ray, Ultrasound orders, and imaging impressions")
@RestController
@RequestMapping("/api/v1/radiology")
@RequiredArgsConstructor
public class RadiologyController {

    private final RadiologyOrderRepository radiologyOrderRepository;
    private final PatientRepository patientRepository;

    @Operation(summary = "List radiology orders")
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<RadiologyOrder>>> getOrders(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) String status) {
        if (patientId != null) {
            return ResponseEntity.ok(ApiResponse.ok(radiologyOrderRepository.findByPatientIdOrderByOrderedAtDesc(patientId)));
        }
        if (status != null) {
            return ResponseEntity.ok(ApiResponse.ok(radiologyOrderRepository.findByStatus(status)));
        }
        return ResponseEntity.ok(ApiResponse.ok(radiologyOrderRepository.findAll()));
    }

    @Operation(summary = "Create radiology order")
    @PostMapping("/orders")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<RadiologyOrder>> createOrder(@RequestBody Map<String, Object> body) {
        Long patientId = Long.valueOf(body.get("patientId").toString());
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        String modality = (String) body.get("modality");
        String bodyPart = (String) body.get("bodyPart");
        String priority = body.containsKey("priority") ? (String) body.get("priority") : "ROUTINE";

        String orderNo = "RAD-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

        RadiologyOrder order = RadiologyOrder.builder()
                .orderNumber(orderNo)
                .patient(patient)
                .modality(modality)
                .bodyPart(bodyPart)
                .priority(priority)
                .status("ORDERED")
                .orderedAt(Instant.now())
                .build();

        RadiologyOrder saved = radiologyOrderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Radiology scan ordered", saved));
    }
}
