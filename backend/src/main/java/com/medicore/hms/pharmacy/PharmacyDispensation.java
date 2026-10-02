package com.medicore.hms.pharmacy;

import com.medicore.hms.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "pharmacy_dispensations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacyDispensation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dispense_number", nullable = false, unique = true, length = 50)
    private String dispenseNumber;

    @Column(name = "prescription_id")
    private Long prescriptionId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "dispensed_by", length = 100)
    private String dispensedBy;

    @Column(length = 50)
    @Builder.Default
    private String status = "DISPENSED";

    @Column(name = "total_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "dispensed_at")
    @Builder.Default
    private Instant dispensedAt = Instant.now();
}
