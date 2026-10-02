package com.medicore.hms.doctor;

import com.medicore.hms.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Doctors", description = "Endpoints for managing physicians, clinical schedules, and availability")
@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @Operation(summary = "List all doctors")
    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorDto>>> getAllDoctors(
            @RequestParam(required = false) Long departmentId) {
        if (departmentId != null) {
            return ResponseEntity.ok(ApiResponse.ok(doctorService.getDoctorsByDepartment(departmentId)));
        }
        return ResponseEntity.ok(ApiResponse.ok(doctorService.getAllDoctors()));
    }

    @Operation(summary = "Get doctor by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorDto>> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(doctorService.getDoctorById(id)));
    }
}
