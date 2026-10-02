package com.medicore.hms.staff;

import com.medicore.hms.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Staff", description = "Endpoints for managing hospital clinical and administrative staff")
@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @Operation(summary = "List all staff members")
    @GetMapping
    public ResponseEntity<ApiResponse<List<Staff>>> getAllStaff() {
        return ResponseEntity.ok(ApiResponse.ok(staffService.getAllStaff()));
    }

    @Operation(summary = "Get staff member by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Staff>> getStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(staffService.getStaffById(id)));
    }
}
