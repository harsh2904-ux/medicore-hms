package com.medicore.hms.billing;

import com.medicore.hms.common.ApiResponse;
import com.medicore.hms.common.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Tag(name = "Billing & Financials", description = "Endpoints for invoices, payments, financial summaries, and claims")
@RestController
@RequestMapping("/api/v1/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @Operation(summary = "Get overall hospital billing and collection overview")
    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<BillingService.BillingOverviewDto>> getOverview() {
        return ResponseEntity.ok(ApiResponse.ok(billingService.getOverview()));
    }

    @Operation(summary = "List and search patient invoices")
    @GetMapping("/invoices")
    public ResponseEntity<ApiResponse<PageResponse<Invoice>>> getInvoices(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(billingService.getInvoices(status, pageable)));
    }

    @Operation(summary = "Get invoice by ID")
    @GetMapping("/invoices/{id}")
    public ResponseEntity<ApiResponse<Invoice>> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(billingService.getInvoiceById(id)));
    }

    @Operation(summary = "Generate new patient invoice")
    @PostMapping("/invoices")
    @PreAuthorize("hasAnyRole('ADMIN', 'BILLING')")
    public ResponseEntity<ApiResponse<Invoice>> createInvoice(@RequestBody Map<String, Object> body) {
        Long patientId = Long.valueOf(body.get("patientId").toString());
        BigDecimal discount = body.containsKey("discount") ? new BigDecimal(body.get("discount").toString()) : BigDecimal.ZERO;
        String notes = body.containsKey("notes") ? (String) body.get("notes") : null;

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> itemsRaw = (List<Map<String, Object>>) body.get("items");
        List<InvoiceItem> items = itemsRaw.stream().map(m -> InvoiceItem.builder()
                .itemType((String) m.getOrDefault("itemType", "SERVICE"))
                .description((String) m.get("description"))
                .quantity((Integer) m.getOrDefault("quantity", 1))
                .unitPrice(new BigDecimal(m.get("unitPrice").toString()))
                .build()).toList();

        Invoice invoice = billingService.createInvoice(patientId, items, discount, LocalDate.now().plusDays(15), notes);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Invoice generated", invoice));
    }

    @Operation(summary = "Process and record invoice payment")
    @PostMapping("/invoices/{id}/payments")
    @PreAuthorize("hasAnyRole('ADMIN', 'BILLING', 'RECEPTIONIST')")
    public ResponseEntity<ApiResponse<Payment>> recordPayment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        String method = body.containsKey("paymentMethod") ? (String) body.get("paymentMethod") : "CASH";
        String ref = body.containsKey("referenceNumber") ? (String) body.get("referenceNumber") : null;

        Payment payment = billingService.recordPayment(id, amount, method, ref);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Payment processed successfully", payment));
    }
}
