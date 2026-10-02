package com.medicore.hms.billing;

import com.medicore.hms.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "insurance_claims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsuranceClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "claim_number", nullable = false, unique = true, length = 50)
    private String claimNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "invoice_id")
    private Long invoiceId;

    @Column(name = "provider_name", nullable = false, length = 150)
    private String providerName;

    @Column(name = "policy_number", nullable = false, length = 100)
    private String policyNumber;

    @Column(name = "claim_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal claimAmount = BigDecimal.ZERO;

    @Column(name = "approved_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal approvedAmount = BigDecimal.ZERO;

    @Column(length = 50)
    @Builder.Default
    private String status = "PENDING";

    @Column(name = "submitted_date")
    @Builder.Default
    private LocalDate submittedDate = LocalDate.now();

    @Column(name = "approved_date")
    private LocalDate approvedDate;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
