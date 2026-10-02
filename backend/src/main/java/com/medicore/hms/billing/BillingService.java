package com.medicore.hms.billing;

import com.medicore.hms.common.BadRequestException;
import com.medicore.hms.common.PageResponse;
import com.medicore.hms.common.ResourceNotFoundException;
import com.medicore.hms.patient.Patient;
import com.medicore.hms.patient.PatientRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final InsuranceClaimRepository claimRepository;
    private final PatientRepository patientRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BillingOverviewDto {
        private BigDecimal totalBilled;
        private BigDecimal totalCollected;
        private BigDecimal totalOutstanding;
        private long pendingInvoicesCount;
        private long claimsCount;
    }

    @Transactional(readOnly = true)
    public PageResponse<Invoice> getInvoices(String status, Pageable pageable) {
        Page<Invoice> page;
        if (status != null && !status.isBlank()) {
            page = invoiceRepository.findByPaymentStatus(status.toUpperCase(), pageable);
        } else {
            page = invoiceRepository.findAll(pageable);
        }
        return PageResponse.from(page);
    }

    @Transactional(readOnly = true)
    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));
    }

    @Transactional
    public Invoice createInvoice(Long patientId, List<InvoiceItem> items, BigDecimal discount, LocalDate dueDate, String notes) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        BigDecimal subtotal = BigDecimal.ZERO;
        for (InvoiceItem item : items) {
            BigDecimal lineTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            item.setTotalPrice(lineTotal);
            subtotal = subtotal.add(lineTotal);
        }

        BigDecimal discountAmt = discount != null ? discount : BigDecimal.ZERO;
        BigDecimal taxRate = BigDecimal.valueOf(8.50);
        BigDecimal taxable = subtotal.subtract(discountAmt).max(BigDecimal.ZERO);
        BigDecimal taxAmount = taxable.multiply(taxRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal total = taxable.add(taxAmount);

        String invNumber = "INV-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

        Invoice invoice = Invoice.builder()
                .invoiceNumber(invNumber)
                .patient(patient)
                .subtotal(subtotal)
                .taxRate(taxRate)
                .taxAmount(taxAmount)
                .discount(discountAmt)
                .totalAmount(total)
                .paidAmount(BigDecimal.ZERO)
                .balanceAmount(total)
                .paymentStatus("UNPAID")
                .dueDate(dueDate != null ? dueDate : LocalDate.now().plusDays(15))
                .notes(notes)
                .build();

        for (InvoiceItem item : items) {
            item.setInvoice(invoice);
        }
        invoice.setItems(items);

        return invoiceRepository.save(invoice);
    }

    @Transactional
    public Payment recordPayment(Long invoiceId, BigDecimal amount, String paymentMethod, String refNumber) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", invoiceId));

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Payment amount must be greater than zero");
        }

        String payNumber = "PAY-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

        Payment payment = Payment.builder()
                .paymentNumber(payNumber)
                .invoice(invoice)
                .amount(amount)
                .paymentMethod(paymentMethod != null ? paymentMethod.toUpperCase() : "CASH")
                .referenceNumber(refNumber)
                .status("COMPLETED")
                .paymentDate(Instant.now())
                .build();

        Payment saved = paymentRepository.save(payment);

        BigDecimal newPaid = invoice.getPaidAmount().add(amount);
        BigDecimal newBalance = invoice.getTotalAmount().subtract(newPaid).max(BigDecimal.ZERO);

        invoice.setPaidAmount(newPaid);
        invoice.setBalanceAmount(newBalance);

        if (newBalance.compareTo(BigDecimal.ZERO) == 0) {
            invoice.setPaymentStatus("PAID");
        } else {
            invoice.setPaymentStatus("PARTIAL");
        }

        invoiceRepository.save(invoice);
        return saved;
    }

    @Transactional(readOnly = true)
    public BillingOverviewDto getOverview() {
        BigDecimal billed = invoiceRepository.getTotalBilledAmount();
        BigDecimal collected = invoiceRepository.getTotalCollectedAmount();
        BigDecimal outstanding = invoiceRepository.getTotalOutstandingAmount();
        long pendingCount = invoiceRepository.count();
        long claimsCount = claimRepository.count();

        return BillingOverviewDto.builder()
                .totalBilled(billed)
                .totalCollected(collected)
                .totalOutstanding(outstanding)
                .pendingInvoicesCount(pendingCount)
                .claimsCount(claimsCount)
                .build();
    }
}
