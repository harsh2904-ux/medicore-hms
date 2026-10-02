package com.medicore.hms.billing;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    List<Invoice> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    Page<Invoice> findByPaymentStatus(String paymentStatus, Pageable pageable);

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i")
    BigDecimal getTotalBilledAmount();

    @Query("SELECT COALESCE(SUM(i.paidAmount), 0) FROM Invoice i")
    BigDecimal getTotalCollectedAmount();

    @Query("SELECT COALESCE(SUM(i.balanceAmount), 0) FROM Invoice i")
    BigDecimal getTotalOutstandingAmount();
}
