package com.medicore.hms.billing;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payment_number", nullable = false, unique = true, length = 50)
    private String paymentNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_method", length = 50)
    @Builder.Default
    private String paymentMethod = "CASH";

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(length = 50)
    @Builder.Default
    private String status = "COMPLETED";

    @Column(name = "payment_date")
    @Builder.Default
    private Instant paymentDate = Instant.now();
}
