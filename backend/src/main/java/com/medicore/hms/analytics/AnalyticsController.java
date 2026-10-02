package com.medicore.hms.analytics;

import com.medicore.hms.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Analytics & Reports", description = "Endpoints for executive KPIs, clinical metrics, revenue trends, and departmental stats")
@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Operation(summary = "Get hospital operational dashboard overview KPIs")
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AnalyticsService.DashboardOverviewDto>> getDashboardOverview() {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getDashboardOverview()));
    }
}
