package com.medicore.hms;

import com.medicore.hms.billing.*;
import com.medicore.hms.patient.Patient;
import com.medicore.hms.patient.PatientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BillingServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;
    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private BillingService billingService;

    @Test
    void testCreateInvoice_CalculatesTaxAndTotal() {
        Patient patient = Patient.builder().id(1L).firstName("Test").lastName("User").build();
        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> inv.getArgument(0));

        List<InvoiceItem> items = new ArrayList<>();
        items.add(InvoiceItem.builder().description("Consultation").quantity(1).unitPrice(BigDecimal.valueOf(100.00)).build());

        Invoice result = billingService.createInvoice(1L, items, BigDecimal.ZERO, LocalDate.now().plusDays(10), "Test invoice");

        assertNotNull(result);
        assertEquals(BigDecimal.valueOf(100.00), result.getSubtotal());
        // 8.5% tax on 100 is 8.50, total 108.50
        assertEquals(new BigDecimal("8.50"), result.getTaxAmount());
        assertEquals(new BigDecimal("108.50"), result.getTotalAmount());
        assertEquals("UNPAID", result.getPaymentStatus());
    }

    @Test
    void testRecordPayment_ReducesBalance() {
        Invoice invoice = Invoice.builder()
                .id(10L)
                .totalAmount(new BigDecimal("100.00"))
                .paidAmount(BigDecimal.ZERO)
                .balanceAmount(new BigDecimal("100.00"))
                .paymentStatus("UNPAID")
                .build();

        when(invoiceRepository.findById(10L)).thenReturn(Optional.of(invoice));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> inv.getArgument(0));

        Payment payment = billingService.recordPayment(10L, new BigDecimal("100.00"), "CREDIT_CARD", "REF-123");

        assertNotNull(payment);
        assertEquals(new BigDecimal("100.00"), invoice.getPaidAmount());
        assertEquals(0, BigDecimal.ZERO.compareTo(invoice.getBalanceAmount()));
        assertEquals("PAID", invoice.getPaymentStatus());
    }
}
