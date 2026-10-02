package com.medicore.hms.pharmacy;

import com.medicore.hms.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Tag(name = "Pharmacy", description = "Endpoints for pharmaceutical catalog, prescriptions dispensing, and fulfillment")
@RestController
@RequestMapping("/api/v1/pharmacy")
@RequiredArgsConstructor
public class PharmacyController {

    private final PharmacyService pharmacyService;

    @Operation(summary = "List all pharmacy medicines catalog")
    @GetMapping("/medicines")
    public ResponseEntity<ApiResponse<List<Medicine>>> getAllMedicines() {
        return ResponseEntity.ok(ApiResponse.ok(pharmacyService.getAllMedicines()));
    }

    @Operation(summary = "Get medicine by ID")
    @GetMapping("/medicines/{id}")
    public ResponseEntity<ApiResponse<Medicine>> getMedicineById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(pharmacyService.getMedicineById(id)));
    }

    @Operation(summary = "List all dispensed medications")
    @GetMapping("/dispensations")
    public ResponseEntity<ApiResponse<List<PharmacyDispensation>>> getDispensations() {
        return ResponseEntity.ok(ApiResponse.ok(pharmacyService.getAllDispensations()));
    }

    @Operation(summary = "Dispense prescription to patient")
    @PostMapping("/dispense")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<PharmacyDispensation>> dispense(@RequestBody Map<String, Object> body) {
        Long patientId = Long.valueOf(body.get("patientId").toString());
        Long rxId = body.containsKey("prescriptionId") && body.get("prescriptionId") != null ? Long.valueOf(body.get("prescriptionId").toString()) : null;
        String dispensedBy = body.containsKey("dispensedBy") ? (String) body.get("dispensedBy") : "Clinical Pharmacist";
        BigDecimal amount = body.containsKey("totalAmount") ? new BigDecimal(body.get("totalAmount").toString()) : BigDecimal.valueOf(35.00);

        PharmacyDispensation dispensed = pharmacyService.dispense(rxId, patientId, dispensedBy, amount);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Prescription dispensed", dispensed));
    }
}
